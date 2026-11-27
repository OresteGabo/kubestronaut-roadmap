import assert from "node:assert/strict";
import { test } from "node:test";
import { awsModules } from "../data/learningData";
import { roadmapData } from "../data/roadmapData";
import { parseCalendarDate } from "./calendarDate";
import {
  createTrackerData,
  readTrackerData,
  serializeTracker,
  serializeTrackerBackup,
  type TrackerData,
} from "./trackerStorage";

const taskId = roadmapData[0].checklist[0].id;
const awsTaskId = awsModules[0].tasks[0].id;
const retiredCsTaskId = "cs-programming-language";
const exportedAt = new Date("2026-11-27T12:34:56.789Z");
const fixture: TrackerData = {
  theme: "light",
  learningCheckedTaskIds: [awsTaskId],
  progress: {
    checkedTaskIds: [taskId],
    manualPasses: { cka: true },
    notes: { kcna: "Review networking.\nPractice again tomorrow." },
    targetStartDate: parseCalendarDate("2027-01-15"),
  },
};

test("defaults to dark and round-trips the local storage record", () => {
  assert.equal(createTrackerData().theme, "dark");
  assert.deepEqual(readTrackerData(serializeTracker(fixture), "storage"), {
    ok: true,
    data: fixture,
    retiredIdCount: 0,
  });
});

test("exports readable JSON with an export timestamp and restores all tracker fields", () => {
  const backup = serializeTrackerBackup(fixture, exportedAt);
  assert.match(backup, /\n  "version": 2,/);
  assert.match(backup, /"exportedAt": "2026-11-27T12:34:56.789Z"/);
  assert.deepEqual(readTrackerData(backup, "backup"), {
    ok: true,
    data: fixture,
    retiredIdCount: 0,
  });
});

test("normalizes duplicate tasks, empty notes, and retired IDs from older backups", () => {
  const backup = {
    version: 2,
    exportedAt: exportedAt.toISOString(),
    ...fixture,
    learningCheckedTaskIds: [awsTaskId, awsTaskId, retiredCsTaskId, "aws-task-retired"],
    progress: {
      ...fixture.progress,
      checkedTaskIds: [taskId, taskId, "kcna-step-retired"],
      manualPasses: { cka: true, ckad: false, retired: true },
      notes: { ...fixture.progress.notes, cka: "", retired: "Old note" },
    },
  };
  assert.deepEqual(readTrackerData(JSON.stringify(backup), "backup"), {
    ok: true,
    data: fixture,
    retiredIdCount: 4,
  });
});

test("rejects malformed, unsupported, and incomplete backup envelopes", () => {
  const valid = { version: 2, exportedAt: exportedAt.toISOString(), ...fixture };
  const cases = [
    "{",
    "[]",
    "null",
    JSON.stringify({ ...valid, version: 3 }),
    JSON.stringify({ ...valid, version: "2" }),
    JSON.stringify({ ...valid, exportedAt: "2026-02-29T12:00:00.000Z" }),
    serializeTracker(fixture),
  ];

  for (const source of cases) assert.equal(readTrackerData(source, "backup").ok, false, source);
});

test("rejects invalid data even when an invalid value belongs to a retired ID", () => {
  const valid = { version: 2, exportedAt: exportedAt.toISOString(), ...fixture };
  const invalidProgress = [
    { ...fixture.progress, checkedTaskIds: [taskId, 3] },
    { ...fixture.progress, manualPasses: { retired: "yes" } },
    { ...fixture.progress, notes: { retired: 5 } },
    { ...fixture.progress, notes: [] },
    { ...fixture.progress, targetStartDate: "2026-02-30" },
    { ...fixture.progress, targetStartDate: "0000-01-01" },
    { ...fixture.progress, targetStartDate: undefined },
  ];
  for (const progress of invalidProgress) {
    assert.equal(readTrackerData(JSON.stringify({ ...valid, progress }), "backup").ok, false);
  }
  assert.equal(readTrackerData(JSON.stringify({ ...valid, theme: "system" }), "backup").ok, false);
});

test("loads version 1 saves and backups with Kubernetes progress and an empty AWS checklist", () => {
  const legacy = { version: 1, theme: fixture.theme, progress: fixture.progress };
  const expected = {
    ok: true,
    data: { ...fixture, learningCheckedTaskIds: [] },
    retiredIdCount: 0,
  };
  assert.deepEqual(readTrackerData(JSON.stringify(legacy), "storage"), expected);
  assert.deepEqual(
    readTrackerData(JSON.stringify({ ...legacy, exportedAt: exportedAt.toISOString() }), "backup"),
    expected,
  );
});

test("rejects version 2 backups with a missing or invalid AWS checklist", () => {
  const raw = { version: 2, exportedAt: exportedAt.toISOString(), ...fixture };
  for (const learningCheckedTaskIds of [undefined, null, awsTaskId, [awsTaskId, 5], ["invalid id"]]) {
    assert.equal(readTrackerData(JSON.stringify({ ...raw, learningCheckedTaskIds }), "backup").ok, false);
  }
});

test("AWS certifications use unique IDs and one pass step per credential", () => {
  const moduleIds = awsModules.map(({ id }) => id);
  const taskIds = [
    ...roadmapData.flatMap(({ checklist }) => checklist.map(({ id }) => id)),
    ...awsModules.flatMap(({ tasks }) => tasks.map(({ id }) => id)),
  ];
  assert.equal(new Set(moduleIds).size, awsModules.length);
  assert.equal(new Set(taskIds).size, taskIds.length);

  for (const { tasks } of awsModules) {
    assert.equal(tasks.filter((task) => "kind" in task && task.kind === "exam-pass").length, 1);
  }
});
