import { roadmapData, type ChecklistItemId, type StageId } from "../data/roadmapData";
import { addCalendarDays, type CalendarDate } from "./calendarDate";

export interface ProgressState {
  readonly checkedTaskIds: readonly ChecklistItemId[];
  readonly manualPasses: Readonly<Partial<Record<StageId, true>>>;
  readonly notes: Readonly<Partial<Record<StageId, string>>>;
  readonly targetStartDate: CalendarDate | null;
}

export type StageStatus = "not-started" | "in-progress" | "completed";
export type StageFilter = "all" | "remaining" | "completed";

interface EstimatedRange {
  readonly min: number;
  readonly max: number;
}

interface StudyEstimate {
  readonly weeks: EstimatedRange;
  readonly hours: EstimatedRange;
}

interface CompletionWindow {
  readonly earliest: CalendarDate;
  readonly latest: CalendarDate;
}

type CertificationStage = (typeof roadmapData)[number];

export interface StageProgress {
  readonly stage: CertificationStage;
  readonly checkedSteps: number;
  readonly totalSteps: number;
  readonly remainingSteps: number;
  readonly completionPercent: number;
  readonly examPassChecked: boolean;
  readonly manuallyPassed: boolean;
  readonly passed: boolean;
  readonly status: StageStatus;
  readonly remainingStudy: StudyEstimate;
  readonly completionWindow: CompletionWindow | null;
}

export interface RoadmapProgress {
  readonly startDate: CalendarDate;
  readonly checkedSteps: number;
  readonly totalSteps: number;
  readonly completionPercent: number;
  readonly certificationsPassed: number;
  readonly totalCertifications: number;
  readonly remainingStudy: StudyEstimate;
  readonly stages: readonly StageProgress[];
}

export function createProgressState(): ProgressState {
  return { checkedTaskIds: [], manualPasses: {}, notes: {}, targetStartDate: null };
}

export function setTaskChecked(
  state: ProgressState,
  taskId: ChecklistItemId,
  checked: boolean,
): ProgressState {
  if (state.checkedTaskIds.includes(taskId) === checked) return state;

  return {
    ...state,
    checkedTaskIds: checked
      ? [...state.checkedTaskIds, taskId]
      : state.checkedTaskIds.filter((id) => id !== taskId),
  };
}

export function setManualPass(
  state: ProgressState,
  stageId: StageId,
  passed: boolean,
): ProgressState {
  const manualPasses = { ...state.manualPasses };
  if (passed) {
    manualPasses[stageId] = true;
  } else {
    delete manualPasses[stageId];
  }
  return { ...state, manualPasses };
}

export function setStageNote(
  state: ProgressState,
  stageId: StageId,
  note: string,
): ProgressState {
  const notes = { ...state.notes };
  if (note === "") {
    delete notes[stageId];
  } else {
    notes[stageId] = note;
  }
  return { ...state, notes };
}

export function setTargetStartDate(
  state: ProgressState,
  targetStartDate: CalendarDate | null,
): ProgressState {
  return { ...state, targetStartDate };
}

export function getRoadmapProgress(
  state: ProgressState,
  today: CalendarDate,
): RoadmapProgress {
  const startDate = state.targetStartDate ?? today;
  const checkedIds = new Set(state.checkedTaskIds);
  const remainingStudy = { weeks: { min: 0, max: 0 }, hours: { min: 0, max: 0 } };
  let checkedSteps = 0;
  let totalSteps = 0;
  let certificationsPassed = 0;

  const stages = roadmapData.map((stage): StageProgress => {
    const checkedItems = stage.checklist.filter((item) => checkedIds.has(item.id));
    const count = checkedItems.length;
    const total = stage.checklist.length;
    const remainingSteps = total - count;
    const remainingFraction = remainingSteps / total;
    const examPassChecked = checkedItems.some((item) => item.kind === "exam-pass");
    const manuallyPassed = state.manualPasses[stage.id] === true;
    const passed = examPassChecked || manuallyPassed;
    const status = getStageStatus(passed, remainingSteps, count);
    const study = {
      weeks: prorate(stage.study.weeks, remainingFraction),
      hours: prorate(stage.study.hours, remainingFraction),
    };

    checkedSteps += count;
    totalSteps += total;
    if (passed) certificationsPassed += 1;

    remainingStudy.weeks.min += study.weeks.min;
    remainingStudy.weeks.max += study.weeks.max;
    remainingStudy.hours.min += study.hours.min;
    remainingStudy.hours.max += study.hours.max;

    return {
      stage,
      checkedSteps: count,
      totalSteps: total,
      remainingSteps,
      completionPercent: (count / total) * 100,
      examPassChecked,
      manuallyPassed,
      passed,
      status,
      remainingStudy: study,
      completionWindow: remainingSteps === 0 ? null : {
        earliest: addCalendarDays(startDate, forecastDays(remainingStudy.weeks.min)),
        latest: addCalendarDays(startDate, forecastDays(remainingStudy.weeks.max)),
      },
    };
  });

  return {
    startDate,
    checkedSteps,
    totalSteps,
    completionPercent: (checkedSteps / totalSteps) * 100,
    certificationsPassed,
    totalCertifications: stages.length,
    remainingStudy,
    stages,
  };
}

export function filterStages(
  stages: readonly StageProgress[],
  filter: StageFilter,
): readonly StageProgress[] {
  if (filter === "remaining") return stages.filter((stage) => stage.remainingSteps > 0);
  if (filter === "completed") return stages.filter((stage) => stage.status === "completed");
  return stages;
}

function getStageStatus(
  passed: boolean,
  remainingSteps: number,
  checkedSteps: number,
): StageStatus {
  if (passed || remainingSteps === 0) return "completed";
  return checkedSteps > 0 ? "in-progress" : "not-started";
}

function prorate([min, max]: readonly [number, number], fraction: number): EstimatedRange {
  return { min: min * fraction, max: max * fraction };
}

function forecastDays(weeks: number): number {
  // Suppress floating-point noise before rounding cumulative time up to a day.
  return Math.ceil(Math.round(weeks * 7 * 1e9) / 1e9);
}
