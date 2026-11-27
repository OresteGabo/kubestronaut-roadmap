import { ArrowUpRight, ChevronDown, Cloud, GraduationCap } from "lucide-react";
import { awsModules, csModules, type LearningModule, type LearningTaskId } from "../data/learningData";

interface FurtherStudyProps {
  readonly checkedTaskIds: readonly LearningTaskId[];
  readonly onTaskChange: (id: LearningTaskId, checked: boolean) => void;
}

const studyTracks = [
  {
    id: "aws",
    title: "AWS skills and certifications",
    description: "Review cloud fundamentals if you need them, then start with Solutions Architect – Associate. Choose CloudOps for platform work or Developer for backend work.",
    icon: Cloud,
    modules: awsModules,
  },
  {
    id: "computer-science",
    title: "Computer science foundations",
    description: "Apply coursework to a portfolio project. Build and test a small application, deploy it, and document the design decisions you can explain in an interview.",
    icon: GraduationCap,
    modules: csModules,
  },
] as const;

type StudyModule = (typeof studyTracks)[number]["modules"][number];

interface StudyModuleProps {
  readonly module: StudyModule;
  readonly checked: ReadonlySet<LearningTaskId>;
  readonly onTaskChange: FurtherStudyProps["onTaskChange"];
}

function StudyModuleDetails({ module, checked, onTaskChange }: StudyModuleProps) {
  const content: LearningModule = module;
  const { certification } = content;
  const checkedSteps = module.tasks.filter(({ id }) => checked.has(id)).length;
  const examPassed = module.tasks.some((task) => (
    "kind" in task && task.kind === "exam-pass" && checked.has(task.id)
  ));

  return (
    <details id={module.id} className="group/study scroll-mt-6">
      <summary className="grid min-h-18 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 hover:bg-raised/50 focus-visible:outline-offset-[-3px]! sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="grid min-w-0 gap-1.5">
          <span className="text-sm leading-snug font-semibold text-ink sm:text-base">{module.title}</span>
          {certification && (
            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs font-medium">
              <span className="font-mono text-muted">{certification.code}</span>
              <span className={certification.priority === "Recommended first" ? "text-accent" : "text-muted"}>
                {certification.priority}
              </span>
              {examPassed && <span className="text-accent">Passed</span>}
            </span>
          )}
        </span>
        <span className="whitespace-nowrap font-mono text-xs text-muted tabular-nums">
          {checkedSteps}/{module.tasks.length}<span className="sr-only"> tasks complete</span>
        </span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted motion-safe:transition-transform group-open/study:rotate-180" />
      </summary>

      <div className="grid gap-4 border-t border-line bg-canvas/40 px-4 py-4 text-sm leading-relaxed sm:px-6 sm:py-5">
        <div className="space-y-2 text-muted">
          <p>{module.summary}</p>
          {certification?.versionNote && <p>{certification.versionNote}</p>}
        </div>

        <fieldset className="min-w-0">
          <legend className="font-semibold text-ink">Checklist<span className="sr-only"> for {module.title}</span></legend>
          <ul role="list" className="mt-1 divide-y divide-line border-b border-line">
            {module.tasks.map((task) => {
              const isChecked = checked.has(task.id);

              return (
                <li key={task.id}>
                  <label className="flex min-h-12 cursor-pointer items-start gap-3 py-3 hover:bg-raised/35">
                    <input
                      id={task.id}
                      type="checkbox"
                      className="mt-[3px] size-[1.125rem] shrink-0 cursor-pointer accent-accent"
                      checked={isChecked}
                      onChange={(event) => onTaskChange(task.id, event.currentTarget.checked)}
                    />
                    <span className={isChecked ? "text-muted line-through" : undefined}>{task.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div className="border-l-2 border-accent-line pl-3">
          <p className="font-semibold">Portfolio project</p>
          <p className="mt-1 text-muted">{module.outcome}</p>
        </div>

        <ul role="list" aria-label={`${module.title} resources`} className="divide-y divide-line">
          {module.resources.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className="flex min-h-11 items-center justify-between gap-2 py-2 text-accent hover:underline">
                <span className="wrap-anywhere">{label}</span>
                <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export function FurtherStudy({ checkedTaskIds, onTaskChange }: FurtherStudyProps) {
  const checked = new Set(checkedTaskIds);

  return (
    <section aria-labelledby="further-study-heading" className="mt-14 sm:mt-20">
      <h2 id="further-study-heading" className="text-3xl leading-none font-semibold tracking-tight sm:text-4xl">
        Further study
      </h2>
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
        {studyTracks.map(({ id, title, description, icon: TrackIcon, modules }) => {
          const taskIds = modules.flatMap(({ tasks }): readonly LearningTaskId[] => tasks.map(({ id }) => id));
          const checkedSteps = taskIds.filter((id) => checked.has(id)).length;
          const headingId = `${id}-heading`;

          return (
            <section key={id} id={id} aria-labelledby={headingId} tabIndex={-1} className="min-w-0 scroll-mt-6 border border-line bg-panel">
              <header className="border-b border-line px-4 pt-5 pb-4 sm:px-6 sm:pt-6">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center border border-accent-line bg-accent-wash text-accent">
                    <TrackIcon className="size-[1.125rem]" />
                  </span>
                  <h3 id={headingId} className="font-display text-xl leading-tight font-bold tracking-tight sm:text-2xl">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
                <p className="mt-4 font-mono text-xs text-muted tabular-nums">{checkedSteps} / {taskIds.length} tasks done</p>
                <div aria-hidden="true" className="mt-2 h-[3px] bg-raised">
                  <div
                    className="h-full bg-accent motion-safe:transition-[width] motion-safe:duration-500"
                    style={{ width: `${(checkedSteps / taskIds.length) * 100}%` }}
                  />
                </div>
              </header>

              <div className="divide-y divide-line">
                {modules.map((module) => (
                  <StudyModuleDetails key={module.id} module={module} checked={checked} onTaskChange={onTaskChange} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
