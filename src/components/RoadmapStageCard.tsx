import { ArrowUpRight, Circle, CircleCheck, CircleDot, Link2, NotebookPen } from "lucide-react";
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
  readonly totalStages: number;
  readonly progress: ProgressState;
  readonly onTaskChange: (id: ChecklistItemId, checked: boolean) => void;
  readonly onPassChange: (passed: boolean) => void;
  readonly onNoteChange: (note: string) => void;
}

export function RoadmapStageCard({
  entry,
  current,
  totalStages,
  progress,
  onTaskChange,
  onPassChange,
  onNoteChange,
}: RoadmapStageCardProps) {
  const {
    stage,
    checkedSteps,
    totalSteps,
    remainingSteps,
    completionPercent,
    manuallyPassed,
    status,
    completionWindow,
  } = entry;
  const { exam, study, formalPrerequisites, suggestedPreparation }: RoadmapStage = stage;
  const { label, icon: StatusIcon } = statuses[status];
  const minutes = exam.durationMinutes;
  const duration = minutes % 60 === 0 ? `${minutes / 60} hours` : `${minutes} min`;
  const headingId = `${stage.id}-heading`;
  const detailsHeading = `${stage.id}-exam-details`;
  const resourcesHeading = `${stage.id}-resources`;

  return (
    <article
      id={stage.id}
      aria-labelledby={headingId}
      className="min-w-0 scroll-mt-4 border border-line bg-panel text-ink"
    >
      <header className="px-5 pt-5 sm:px-8 sm:pt-7">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="font-mono text-[0.6875rem] font-medium tracking-[0.12em] text-muted uppercase">
            Stage {stage.order} of {totalStages}
            {current && <span className="ml-2.5 border-l border-line pl-2.5 text-accent">Current stage</span>}
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
            <StatusIcon
              aria-hidden="true"
              className={status === "not-started" ? "size-3.5" : "size-3.5 text-accent"}
            />
            {label}
          </span>
        </div>

        <h3 id={headingId} className="mt-5 grid gap-2 sm:mt-6">
          <span className="font-display text-5xl leading-none font-bold tracking-[-0.07em] text-ink sm:text-6xl">
            {stage.code}
          </span>
          <span className="text-base leading-snug font-medium text-muted sm:text-lg">{stage.name}</span>
        </h3>

        <dl className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4 border-y border-line py-4 sm:grid-cols-3 sm:gap-x-5">
          <div>
            <dt className="font-mono text-[0.6875rem] tracking-wider text-muted uppercase">Exam format</dt>
            <dd className="mt-1 text-sm font-medium leading-tight">
              {examFormats[exam.format]} <span className="block sm:inline-block"><span className="hidden sm:inline">· </span>{duration}</span>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.6875rem] tracking-wider text-muted uppercase">Study estimate</dt>
            <dd className="mt-1 text-sm font-medium leading-tight">
              {study.weeks.join("–")} weeks <span className="block sm:inline-block"><span className="hidden sm:inline">· </span>{study.hours.join("–")} hours</span>
            </dd>
          </div>
          {completionWindow && (
            <div className="col-span-full sm:col-span-1">
              <dt className="font-mono text-[0.6875rem] tracking-wider text-muted uppercase">Completion forecast</dt>
              <dd className="mt-1 text-sm font-medium leading-tight tabular-nums">
                {dateFormat.formatRange(
                  new Date(`${completionWindow.earliest}T00:00:00Z`),
                  new Date(`${completionWindow.latest}T00:00:00Z`),
                )}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="grid gap-8 px-5 pt-6 pb-7 sm:px-8 sm:pt-7 sm:pb-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <fieldset className="min-w-0">
            <legend className="text-lg font-semibold tracking-tight">Action checklist</legend>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 text-xs text-muted">
              <span className="font-mono tabular-nums">{checkedSteps} / {totalSteps} steps</span>
              <span>{remainingSteps} remaining</span>
            </div>
            <div aria-hidden="true" className="mt-2.5 h-[3px] overflow-hidden bg-raised">
              <div
                className="h-full bg-accent motion-safe:transition-[width] motion-safe:duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="mt-1 divide-y divide-line border-b border-line">
              {stage.checklist.map((item) => {
                const checked = progress.checkedTaskIds.includes(item.id);
                const detailId = "detail" in item ? `${item.id}-detail` : undefined;

                return (
                  <div key={item.id} className="relative hover:bg-raised/35">
                    <label className="flex min-h-12 cursor-pointer items-start gap-3 py-3.5 text-sm leading-relaxed">
                      <input
                        id={item.id}
                        type="checkbox"
                        className="mt-[3px] size-[1.125rem] shrink-0 cursor-pointer accent-accent"
                        aria-describedby={detailId}
                        checked={checked}
                        onChange={(event) => onTaskChange(item.id, event.currentTarget.checked)}
                      />
                      <span className={checked ? "text-muted line-through" : undefined}>{item.label}</span>
                    </label>
                    {"detail" in item && (
                      <p id={detailId} className="-mt-1 pb-3.5 pl-7.5 text-xs leading-relaxed text-muted">{item.detail}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-4 flex min-h-12 cursor-pointer items-center gap-3 border border-accent-line bg-accent-wash px-3 py-2.5 text-sm font-medium">
            <input
              type="checkbox"
              className="size-[1.125rem] shrink-0 cursor-pointer accent-accent"
              checked={manuallyPassed}
              onChange={(event) => onPassChange(event.currentTarget.checked)}
            />
            Mark Cert Passed
          </label>

          <label className="mt-6 grid min-w-0 gap-2 text-sm font-medium">
            <span className="flex items-center gap-2">
              <NotebookPen aria-hidden="true" className="size-4 text-muted" />
              Personal notes
            </span>
            <textarea
              className="min-h-24 w-full min-w-0 resize-y border border-line bg-canvas px-3 py-2.5 font-normal"
              rows={3}
              value={progress.notes[stage.id] ?? ""}
              onChange={(event) => onNoteChange(event.currentTarget.value)}
            />
          </label>
        </div>

        <div className="min-w-0 border-t border-line pt-6 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-7">
          <RoadmapSyllabus stageId={stage.id} domains={stage.domains} />

          <section aria-labelledby={detailsHeading} className="mt-6">
            <h4 id={detailsHeading} className="text-base font-semibold tracking-tight">Exam details</h4>
            <dl className="mt-2 grid gap-3 text-sm leading-relaxed">
              <div>
                <dt className="font-medium">Formal prerequisite</dt>
                <dd className="text-muted">
                  {formalPrerequisites.length === 0
                    ? "None"
                    : formalPrerequisites.map(({ certification, description }) => <p key={certification}>{description}</p>)}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Suggested preparation</dt>
                <dd className="text-muted">{suggestedPreparation}</dd>
              </div>
              <div>
                <dt className="font-medium">Exam logistics</dt>
                <dd className="text-muted">
                  Online proctored · {exam.passingScorePercent}% to pass
                  {exam.questionCount !== null && ` · ${exam.questionCount} questions`}
                </dd>
                {exam.simulator && (
                  <dd className="mt-1.5 text-xs text-muted">
                    {exam.simulator.attempts} {exam.simulator.provider} attempts with standard registration.
                    {" "}{exam.simulator.excludedRegistration} excludes access.
                  </dd>
                )}
              </div>
            </dl>
          </section>

          <section aria-labelledby={resourcesHeading} className="mt-6 border-t border-line pt-5">
            <div className="flex flex-wrap items-center justify-between gap-x-3">
              <h4 id={resourcesHeading} className="text-base font-semibold tracking-tight">Official resources</h4>
              <a
                href={`#${stage.id}`}
                aria-label={`Link to ${stage.code} stage`}
                className="inline-flex min-h-10 items-center gap-1.5 text-xs text-muted hover:text-accent"
              >
                <Link2 aria-hidden="true" className="size-3.5" /> Stage link
              </a>
            </div>
            <ul role="list" className="divide-y divide-line text-sm">
              {stage.resources.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="group flex min-h-10 items-center justify-between gap-3 py-2.5 text-accent hover:underline"
                  >
                    <span className="wrap-anywhere">{label}</span>
                    <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
