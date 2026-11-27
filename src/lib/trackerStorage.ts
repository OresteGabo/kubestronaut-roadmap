import { awsModules, csModules, type LearningTaskId } from "../data/learningData";
import { roadmapData, type ChecklistItemId, type StageId } from "../data/roadmapData";
import { parseCalendarDate } from "./calendarDate";
import { createProgressState, type ProgressState } from "./progress";

export const TRACKER_STORAGE_KEY = "dev.orestegabo.kubestronaut-roadmap.tracker";
const TRACKER_VERSION = 2;
const LEGACY_TRACKER_VERSION = 1;

export type TrackerTheme = "dark" | "light";

export interface TrackerData {
  readonly progress: ProgressState;
  readonly theme: TrackerTheme;
  readonly learningCheckedTaskIds: readonly LearningTaskId[];
}

type ReadResult =
  | { readonly ok: true; readonly data: TrackerData; readonly retiredIdCount: number }
  | { readonly ok: false; readonly message: string };

const stageIds: ReadonlySet<string> = new Set(roadmapData.map(({ id }) => id));
const taskIds: ReadonlySet<string> = new Set(
  roadmapData.flatMap(({ checklist }) => checklist.map(({ id }) => id)),
);
const learningTaskIds: ReadonlySet<string> = new Set(
  [...awsModules, ...csModules].flatMap(({ tasks }) => tasks.map(({ id }) => id)),
);
const roadmapIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function createTrackerData(): TrackerData {
  return { progress: createProgressState(), theme: "dark", learningCheckedTaskIds: [] };
}

export function serializeTracker(data: TrackerData): string {
  return JSON.stringify({ version: TRACKER_VERSION, ...data });
}

export function serializeTrackerBackup(data: TrackerData, exportedAt: Date): string {
  return JSON.stringify({ version: TRACKER_VERSION, exportedAt: exportedAt.toISOString(), ...data }, null, 2) + "\n";
}

export function readTrackerData(input: string, source: "storage" | "backup"): ReadResult {
  let payload: unknown;
  try {
    payload = JSON.parse(input);
  } catch {
    return { ok: false, message: "The file is not valid JSON." };
  }

  if (!isRecord(payload) || !Number.isInteger(payload.version)) {
    return { ok: false, message: "The tracker data is missing a valid version." };
  }
  const isLegacy = payload.version === LEGACY_TRACKER_VERSION;
  if (!isLegacy && payload.version !== TRACKER_VERSION) {
    return { ok: false, message: "This tracker data version is unsupported." };
  }
  if (source === "backup" && !isExportDate(payload.exportedAt)) {
    return { ok: false, message: "The backup is missing a valid export date." };
  }

  const { progress, theme } = payload;
  if (!isRecord(progress) || (theme !== "dark" && theme !== "light")) {
    return { ok: false, message: "The tracker progress or theme is invalid." };
  }

  const learningCheckedTaskIds = isLegacy ? [] : payload.learningCheckedTaskIds;
  if (!Array.isArray(learningCheckedTaskIds) || !learningCheckedTaskIds.every(isRoadmapId)) {
    return { ok: false, message: "The AWS or computer science checklist is invalid." };
  }

  const { checkedTaskIds, manualPasses, notes, targetStartDate } = progress;
  if (
    !Array.isArray(checkedTaskIds) ||
    !checkedTaskIds.every(isRoadmapId) ||
    !isRecord(manualPasses) ||
    !isRecord(notes)
  ) {
    return { ok: false, message: "The checked tasks, pass overrides, or notes are invalid." };
  }

  const parsedDate = typeof targetStartDate === "string" ? parseCalendarDate(targetStartDate) : null;
  if (targetStartDate !== null && parsedDate === null) {
    return { ok: false, message: "The tracker start date is invalid." };
  }

  // Validate every entry before dropping retired IDs, even if its stage no longer exists.
  const retiredIds = new Set<string>();
  const recognizedTasks = new Set<ChecklistItemId>();
  for (const id of checkedTaskIds) {
    if (isTaskId(id)) recognizedTasks.add(id);
    else retiredIds.add(id);
  }

  const recognizedLearningTasks = new Set<LearningTaskId>();
  for (const id of learningCheckedTaskIds) {
    if (isLearningTaskId(id)) recognizedLearningTasks.add(id);
    else retiredIds.add(id);
  }

  const recognizedPasses: Partial<Record<StageId, true>> = {};
  for (const [id, passed] of Object.entries(manualPasses)) {
    if (!isRoadmapId(id) || typeof passed !== "boolean") {
      return { ok: false, message: "A certification pass override is invalid." };
    }
    if (!isStageId(id)) retiredIds.add(id);
    else if (passed) recognizedPasses[id] = true;
  }

  const recognizedNotes: Partial<Record<StageId, string>> = {};
  for (const [id, note] of Object.entries(notes)) {
    if (!isRoadmapId(id) || typeof note !== "string") {
      return { ok: false, message: "A stage note is invalid." };
    }
    if (!isStageId(id)) retiredIds.add(id);
    else if (note !== "") recognizedNotes[id] = note;
  }

  return {
    ok: true,
    data: {
      theme,
      learningCheckedTaskIds: [...recognizedLearningTasks],
      progress: {
        checkedTaskIds: [...recognizedTasks],
        manualPasses: recognizedPasses,
        notes: recognizedNotes,
        targetStartDate: parsedDate,
      },
    },
    retiredIdCount: retiredIds.size,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRoadmapId(value: unknown): value is string {
  return typeof value === "string" && roadmapIdPattern.test(value);
}

function isStageId(value: string): value is StageId {
  return stageIds.has(value);
}

function isTaskId(value: string): value is ChecklistItemId {
  return taskIds.has(value);
}

function isLearningTaskId(value: string): value is LearningTaskId {
  return learningTaskIds.has(value);
}

function isExportDate(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
}
