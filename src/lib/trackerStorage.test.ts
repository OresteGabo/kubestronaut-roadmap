import assert from "node:assert/strict";
import { test } from "node:test";
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
const exportedAt = new Date("2026-11-27T12:34:56.789Z");
const fixture: TrackerData = {
  theme: "light",
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
  assert.match(backup, /\n  "version": 1,/);
  assert.match(backup, /"exportedAt": "2026-11-27T12:34:56.789Z"/);
  assert.deepEqual(readTrackerData(backup, "backup"), {
    ok: true,
    data: fixture,
    retiredIdCount: 0,
  });
});

test("normalizes duplicate tasks, empty notes, and retired IDs", () => {
  const backup = {
    version: 1,
    exportedAt: exportedAt.toISOString(),
    ...fixture,
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
    retiredIdCount: 2,
  });
});

test("rejects malformed, unsupported, and incomplete backup envelopes", () => {
  const valid = { version: 1, exportedAt: exportedAt.toISOString(), ...fixture };
  const cases = [
    "{",
    "[]",
    "null",
    JSON.stringify({ ...valid, version: 2 }),
    JSON.stringify({ ...valid, version: "1" }),
    JSON.stringify({ ...valid, exportedAt: "2026-02-29T12:00:00.000Z" }),
    serializeTracker(fixture),
  ];

  for (const source of cases) assert.equal(readTrackerData(source, "backup").ok, false, source);
});

test("rejects invalid data even when an invalid value belongs to a retired ID", () => {
  const valid = { version: 1, exportedAt: exportedAt.toISOString(), ...fixture };
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
