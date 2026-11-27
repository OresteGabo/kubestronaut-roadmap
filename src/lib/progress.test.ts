import assert from "node:assert/strict";
import { test } from "node:test";
import { roadmapData } from "../data/roadmapData";
import { addCalendarDays, getLocalCalendarDate, parseCalendarDate } from "./calendarDate";
import {
  createProgressState,
  filterStages,
  getRoadmapProgress,
  setManualPass,
  setStageNote,
  setTargetStartDate,
  setTaskChecked,
} from "./progress";

function calendarDate(value: string) {
  const date = parseCalendarDate(value);
  assert.ok(date, `Invalid test date: ${value}`);
  return date;
}

const today = calendarDate("2026-03-25");
const [kcna, cka] = roadmapData;

test("empty progress uses local today and sums the full estimates", () => {
  const progress = getRoadmapProgress(createProgressState(), today);

  assert.equal(progress.startDate, today);
  assert.equal(progress.checkedSteps, 0);
  assert.equal(progress.totalSteps, 22);
  assert.equal(progress.completionPercent, 0);
  assert.equal(progress.certificationsPassed, 0);
  assert.equal(progress.totalCertifications, 5);
  assert.deepEqual(progress.remainingStudy, { weeks: { min: 14, max: 22 }, hours: { min: 170, max: 235 } });
  assert.ok(progress.stages.every(({ status }) => status === "not-started"));
  assert.deepEqual(filterStages(progress.stages, "all"), progress.stages);
  assert.deepEqual(filterStages(progress.stages, "remaining"), progress.stages);
  assert.deepEqual(filterStages(progress.stages, "completed"), []);
  assert.deepEqual(progress.stages[0].completionWindow, { earliest: "2026-04-08", latest: "2026-04-15" });
  assert.deepEqual(progress.stages[4].completionWindow, { earliest: "2026-07-01", latest: "2026-08-26" });
});

test("fully checked progress has five passes and consumes no forecast time", () => {
  const checkedTaskIds = roadmapData.flatMap(({ checklist }) => checklist.map(({ id }) => id));
  const progress = getRoadmapProgress({ ...createProgressState(), checkedTaskIds }, today);

  assert.equal(progress.checkedSteps, 22);
  assert.equal(progress.completionPercent, 100);
  assert.equal(progress.certificationsPassed, 5);
  assert.deepEqual(progress.remainingStudy, { weeks: { min: 0, max: 0 }, hours: { min: 0, max: 0 } });
  assert.ok(progress.stages.every(({ status, completionWindow }) => status === "completed" && completionWindow === null));
  assert.deepEqual(filterStages(progress.stages, "remaining"), []);
});

test("a study task alone starts a stage and updates its remaining estimates", () => {
  const initial = createProgressState();
  const taskId = kcna.checklist[0].id;
  const partial = setTaskChecked(initial, taskId, true);
  const progress = getRoadmapProgress(partial, today);
  const stage = progress.stages[0];

  assert.deepEqual(initial.checkedTaskIds, []);
  assert.equal(setTaskChecked(partial, taskId, true), partial);
  assert.equal(progress.checkedSteps, 1);
  assert.equal(progress.completionPercent, (1 / 22) * 100);
  assert.equal(progress.certificationsPassed, 0);
  assert.equal(stage.status, "in-progress");
  assert.equal(stage.remainingSteps, 4);
  assert.equal(stage.completionPercent, 20);
  assert.equal(stage.remainingStudy.weeks.min, 1.6);
  assert.ok(Math.abs(stage.remainingStudy.weeks.max - 2.4) < 1e-12);
  assert.deepEqual(stage.remainingStudy.hours, { min: 16, max: 24 });
  assert.deepEqual(progress.remainingStudy.hours, { min: 166, max: 229 });
  assert.deepEqual(setTaskChecked(partial, taskId, false), initial);
});

test("a manual pass counts separately and remains visible in both filters while tasks remain", () => {
  const initial = createProgressState();
  const manual = setManualPass(initial, kcna.id, true);
  const progress = getRoadmapProgress(manual, today);
  const stage = progress.stages[0];

  assert.deepEqual(initial.manualPasses, {});
  assert.equal(progress.certificationsPassed, 1);
  assert.equal(progress.checkedSteps, 0);
  assert.equal(stage.manuallyPassed, true);
  assert.equal(stage.examPassChecked, false);
  assert.equal(stage.passed, true);
  assert.equal(stage.status, "completed");
  assert.deepEqual(stage.remainingStudy, { weeks: { min: 2, max: 3 }, hours: { min: 20, max: 30 } });
  assert.deepEqual(stage.completionWindow, { earliest: "2026-04-08", latest: "2026-04-15" });
  assert.ok(filterStages(progress.stages, "remaining").includes(stage));
  assert.deepEqual(filterStages(progress.stages, "completed"), [stage]);
  assert.equal(getRoadmapProgress(setManualPass(manual, kcna.id, false), today).stages[0].status, "not-started");
});

test("clearing a manual pass preserves exam-pass evidence, notes, and other checkboxes", () => {
  const examTaskId = kcna.checklist[4].id;
  const studyTaskId = kcna.checklist[0].id;
  const initial = setStageNote(createProgressState(), kcna.id, "Review networking.");
  const checked = setTaskChecked(setTaskChecked(initial, examTaskId, true), studyTaskId, true);
  const manual = setManualPass(checked, kcna.id, true);
  const withBoth = getRoadmapProgress(manual, today);
  const cleared = setManualPass(manual, kcna.id, false);
  const progress = getRoadmapProgress(cleared, today);

  assert.equal(withBoth.certificationsPassed, 1);
  assert.equal(progress.certificationsPassed, 1);
  assert.equal(progress.stages[0].manuallyPassed, false);
  assert.equal(progress.stages[0].examPassChecked, true);
  assert.equal(progress.stages[0].status, "completed");
  assert.equal(progress.stages[0].remainingSteps, 3);
  assert.deepEqual(cleared, checked);
  assert.equal(cleared.notes.kcna, "Review networking.");
  assert.deepEqual(setStageNote(cleared, kcna.id, "").notes, {});

  const withoutPass = getRoadmapProgress(setTaskChecked(cleared, examTaskId, false), today);
  assert.equal(withoutPass.certificationsPassed, 0);
  assert.equal(withoutPass.stages[0].status, "in-progress");
});

test("completed checklists are skipped and start date edits recalculate downstream forecasts", () => {
  const initial = createProgressState();
  const fullKcna = { ...initial, checkedTaskIds: kcna.checklist.map(({ id }) => id) };
  const original = getRoadmapProgress(initial, today);
  const skipped = getRoadmapProgress(fullKcna, today);

  assert.deepEqual(original.stages[1].completionWindow, { earliest: "2026-05-13", latest: "2026-06-10" });
  assert.equal(skipped.stages[0].completionWindow, null);
  assert.deepEqual(skipped.stages[1].completionWindow, { earliest: "2026-04-29", latest: "2026-05-20" });

  const later = setTargetStartDate(fullKcna, calendarDate("2026-03-31"));
  assert.deepEqual(getRoadmapProgress(later, today).stages[1].completionWindow, {
    earliest: "2026-05-05",
    latest: "2026-05-26",
  });
  assert.equal(fullKcna.targetStartDate, null);
  assert.equal(getRoadmapProgress(setTargetStartDate(later, null), today).startDate, today);
});

test("fractional stage estimates are summed before rounding to a calendar day", () => {
  const state = {
    ...createProgressState(),
    checkedTaskIds: [...kcna.checklist.slice(0, 4), ...cka.checklist.slice(0, 4)].map(({ id }) => id),
  };
  const { stages } = getRoadmapProgress(state, today);

  assert.deepEqual(stages[0].completionWindow, { earliest: "2026-03-28", latest: "2026-03-30" });
  assert.deepEqual(stages[1].completionWindow, { earliest: "2026-04-04", latest: "2026-04-10" });
});

test("calendar arithmetic handles month, leap day, and spring and fall DST boundaries", () => {
  assert.equal(addCalendarDays(calendarDate("2028-02-28"), 1), "2028-02-29");
  assert.equal(addCalendarDays(calendarDate("2028-02-28"), 2), "2028-03-01");
  assert.equal(addCalendarDays(calendarDate("2026-03-28"), 2), "2026-03-30");
  assert.equal(addCalendarDays(calendarDate("2026-03-07"), 2), "2026-03-09");
  assert.equal(addCalendarDays(calendarDate("2026-10-24"), 2), "2026-10-26");
  assert.equal(addCalendarDays(calendarDate("2026-10-31"), 2), "2026-11-02");
  assert.equal(parseCalendarDate("2026-02-29"), null);
  assert.equal(parseCalendarDate("2026-03-29T00:00:00Z"), null);
  assert.equal(getLocalCalendarDate(new Date(2026, 2, 29, 0, 30)), "2026-03-29");
  assert.equal(getLocalCalendarDate(new Date(2026, 2, 29, 23, 30)), "2026-03-29");
});
