import { ArrowUpRight, ChevronDown, Circle, CircleCheck, CircleDot, Link2 } from "lucide-react";
import type { ChecklistItemId, ExamFormat, RoadmapStage } from "../data/roadmapData";
import type { ProgressState, StageProgress, StageStatus } from "../lib/progress";
import { RoadmapSyllabus } from "./RoadmapSyllabus";

const statuses = {
  "not-started": { label: "Not Started", icon: Circle },
  "in-progress": { label: "In Progress", icon: CircleDot },
  completed: { label: "Completed", icon: CircleCheck },
} satisfies Record<StageStatus, { label: string; icon: typeof Circle }>;

const examFormats: Record<ExamFormat, string> = {
  "multiple-choice": "Multiple choice",
  "performance-based-cli": "Performance-based CLI",
};

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" });

interface RoadmapStageCardProps {
  readonly entry: StageProgress;
  readonly current: boolean;
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly totalStages: number;
  readonly progress: ProgressState;
  readonly onTaskChange: (id: ChecklistItemId, checked: boolean) => void;
  readonly onPassChange: (passed: boolean) => void;
  readonly onNoteChange: (note: string) => void;
}

export function RoadmapStageCard({
  entry,
  current,
  isOpen,
  onOpenChange,
  totalStages,
  progress,
  onTaskChange,
  onPassChange,
  onNoteChange,
}: RoadmapStageCardProps) {
  const { stage, checkedSteps, totalSteps, remainingSteps, completionPercent, manuallyPassed, status, completionWindow } = entry;
  const { exam, study, formalPrerequisites, suggestedPreparation }: RoadmapStage = stage;
  const { label, icon: StatusIcon } = statuses[status];
  const minutes = exam.durationMinutes;
  const duration = minutes % 60 === 0 ? `${minutes / 60} hours` : `${minutes} min`;
  const studyDuration = `${study.weeks.join("–")} weeks · ${study.hours.join("–")} hours`;
  const resourcesHeading = `${stage.id}-resources`;

  return (
    <details
      id={stage.id}
      open={isOpen}
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
      className={`group/stage scroll-mt-4 rounded-lg border bg-panel ${current ? "border-accent-line" : "border-line"}`}
    >
      <summary
        aria-current={current ? "step" : undefined}
        className={`grid min-h-24 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-lg px-4 py-3.5 group-open/stage:rounded-b-none md:grid-cols-[minmax(0,1fr)_11rem_8rem_auto] md:gap-x-5 md:px-5 lg:grid-cols-[minmax(0,1fr)_12.5rem_8rem_auto] [&::-webkit-details-marker]:hidden ${current ? "bg-accent-wash/65 hover:bg-accent-wash" : "hover:bg-raised/45"}`}
      >
        <span className="min-w-0 space-y-0.5">
          <span className="block font-mono text-xs text-muted">Stage {stage.order} of {totalStages}</span>
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-lg font-semibold tracking-tight">{stage.code}</span>
            {current && <span className="text-xs font-medium text-accent">Current stage</span>}
          </span>
          <span className="block text-sm leading-snug text-muted">{stage.name}</span>
        </span>

        <span className="col-start-1 grid gap-y-0.5 text-xs text-muted md:col-start-2 md:row-start-1">
          <span className="font-medium text-ink">{examFormats[exam.format]} · <span className="whitespace-nowrap">{duration}</span></span>
          <span>{studyDuration}</span>
        </span>

        <span className="col-start-1 grid gap-1.5 text-xs text-muted md:col-start-3 md:row-start-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 md:grid md:gap-1">
            <span className="inline-flex items-center gap-1.5">
              <StatusIcon aria-hidden="true" className="size-3.5 shrink-0" /> {label}
            </span>
            <span className="font-mono tabular-nums">{checkedSteps}/{totalSteps} steps</span>
          </span>
          <span aria-hidden="true" className="h-1 max-w-32 overflow-hidden rounded-full bg-raised">
            <span
              className="block h-full rounded-full bg-accent motion-safe:transition-[width] motion-safe:duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </span>
        </span>

        <ChevronDown
          aria-hidden="true"
          className="col-start-2 row-span-3 row-start-1 size-4 shrink-0 text-muted group-open/stage:rotate-180 motion-safe:transition-transform md:col-start-4 md:row-span-1"
        />
      </summary>

      <div className="divide-y divide-line border-t border-line">
        <dl className="grid gap-x-6 gap-y-4 px-4 py-4 sm:grid-cols-2 md:px-5">
          <div>
            <dt className="text-xs font-medium text-muted">Suggested preparation</dt>
            <dd className="mt-1 text-sm">{suggestedPreparation}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Formal prerequisite</dt>
            <dd className="mt-1 space-y-1 text-sm">
              {formalPrerequisites.length === 0
                ? "None"
                : formalPrerequisites.map(({ certification, description }) => <p key={certification}>{description}</p>)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Exam logistics</dt>
            <dd className="mt-1 text-sm">
              Online proctored · {exam.passingScorePercent}% to pass
              {exam.questionCount !== null && ` · ${exam.questionCount} questions`}
            </dd>
            {exam.simulator && (
              <dd className="mt-1 text-xs text-muted">
                {exam.simulator.attempts} {exam.simulator.provider} attempts with standard registration. {exam.simulator.excludedRegistration} excludes access.
              </dd>
            )}
          </div>
          {completionWindow && (
            <div>
              <dt className="text-xs font-medium text-muted">Forecast completion window</dt>
              <dd className="mt-1 text-sm tabular-nums">
                {dateFormat.formatRange(
                  new Date(`${completionWindow.earliest}T00:00:00Z`),
                  new Date(`${completionWindow.latest}T00:00:00Z`),
                )}
              </dd>
            </div>
          )}
        </dl>

        <div className="grid gap-5 px-4 py-5 md:grid-cols-2 md:gap-7 md:px-5">
          <div className="min-w-0 space-y-4">
            <fieldset className="min-w-0">
              <legend className="mb-2 text-sm font-semibold">
                Action checklist <span className="ml-1 font-normal text-muted">· {remainingSteps} remaining</span>
              </legend>
              <div className="divide-y divide-line rounded-md border border-line bg-canvas">
                {stage.checklist.map((item) => {
                  const checked = progress.checkedTaskIds.includes(item.id);
                  const detailId = "detail" in item ? `${item.id}-detail` : undefined;

                  return (
                    <div key={item.id}>
                      <label className="flex min-h-11 cursor-pointer items-start gap-2.5 px-3 py-2.5 text-sm">
                        <input
                          id={item.id}
                          type="checkbox"
                          className="mt-0.5 size-4 shrink-0 accent-accent"
                          aria-describedby={detailId}
                          checked={checked}
                          onChange={(event) => onTaskChange(item.id, event.currentTarget.checked)}
                        />
                        <span className={checked ? "text-muted line-through" : undefined}>{item.label}</span>
                      </label>
                      {"detail" in item && <p id={detailId} className="px-3 pb-2.5 pl-9.5 text-xs text-muted">{item.detail}</p>}
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md border border-line bg-canvas px-3 text-sm font-medium">
              <input
                type="checkbox"
                className="size-4 shrink-0 accent-accent"
                checked={manuallyPassed}
                onChange={(event) => onPassChange(event.currentTarget.checked)}
              />
              Mark Cert Passed
            </label>
            <label className="grid min-w-0 gap-2 text-sm font-medium">
              Personal notes
              <textarea
                className="min-w-0 rounded-md border border-line bg-canvas px-3 py-2 font-normal"
                rows={2}
                value={progress.notes[stage.id] ?? ""}
                onChange={(event) => onNoteChange(event.currentTarget.value)}
              />
            </label>
          </div>

          <RoadmapSyllabus stageId={stage.id} domains={stage.domains} />
        </div>

        <section aria-labelledby={resourcesHeading} className="px-4 py-4 md:px-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3">
            <h3 id={resourcesHeading} className="text-sm font-semibold">Official resources</h3>
            <a
              href={`#${stage.id}`}
              aria-label={`Link to ${stage.code} stage`}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-sm text-xs text-muted hover:text-accent"
            >
              <Link2 aria-hidden="true" className="size-3.5" /> Stage link
            </a>
          </div>
          <ul role="list" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {stage.resources.map(({ label, href }) => (
              <li key={href} className="min-w-0">
                <a href={href} className="flex h-full min-h-10 items-center justify-between gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-accent hover:bg-accent-wash">
                  <span className="min-w-0 wrap-anywhere">{label}</span>
                  <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </details>
  );
}
