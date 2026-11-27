import { ArrowUpRight, ChevronDown, Cloud } from "lucide-react";
import { awsModules, type LearningTaskId } from "../data/learningData";

interface FurtherStudyProps {
  readonly checkedTaskIds: readonly LearningTaskId[];
  readonly onTaskChange: (id: LearningTaskId, checked: boolean) => void;
}

type StudyModule = (typeof awsModules)[number];
type AwsTask = StudyModule["tasks"][number];

const awsTasks = awsModules.flatMap(({ tasks }): readonly AwsTask[] => tasks);
const examTasks = awsTasks.filter((task) => "kind" in task && task.kind === "exam-pass");

interface StudyModuleProps {
  readonly module: StudyModule;
  readonly checked: ReadonlySet<LearningTaskId>;
  readonly onTaskChange: FurtherStudyProps["onTaskChange"];
}

function StudyModuleDetails({ module, checked, onTaskChange }: StudyModuleProps) {
  const { certification } = module;
  const checkedSteps = module.tasks.filter(({ id }) => checked.has(id)).length;
  const examPassed = module.tasks.some((task) => (
    "kind" in task && task.kind === "exam-pass" && checked.has(task.id)
  ));

  return (
    <details id={module.id} className="group/study scroll-mt-6">
      <summary className="grid min-h-18 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 hover:bg-raised/50 focus-visible:outline-offset-[-3px]! sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="grid min-w-0 gap-1.5">
          <span className="text-sm leading-snug font-semibold text-ink sm:text-base">{module.title}</span>
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs font-medium">
            <span className="font-mono text-muted">{certification.code}</span>
            <span className={certification.priority === "Recommended first" ? "text-accent" : "text-muted"}>
              {certification.priority}
            </span>
            {examPassed && <span className="text-accent">Passed</span>}
          </span>
        </span>
        <span className="whitespace-nowrap font-mono text-xs text-muted tabular-nums">
          {checkedSteps}/{module.tasks.length}<span className="sr-only"> tasks complete</span>
        </span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted motion-safe:transition-transform group-open/study:rotate-180" />
      </summary>

      <div className="grid gap-4 border-t border-line bg-canvas/40 px-4 py-4 text-sm leading-relaxed sm:px-6 sm:py-5">
        <div className="space-y-2 text-muted">
          <p>{module.summary}</p>
          {"versionNote" in certification && <p>{certification.versionNote}</p>}
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
          <p className="font-semibold">Practice lab</p>
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
  const checkedSteps = awsTasks.filter(({ id }) => checked.has(id)).length;
  const examsPassed = examTasks.filter(({ id }) => checked.has(id)).length;

  return (
    <section id="aws" aria-labelledby="aws-heading" tabIndex={-1} className="mt-14 min-w-0 scroll-mt-6 sm:mt-20">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center border border-accent-line bg-accent-wash text-accent">
          <Cloud className="size-[1.125rem]" />
        </span>
        <h2 id="aws-heading" className="text-3xl leading-none font-semibold tracking-tight sm:text-4xl">
          AWS certification roadmap
        </h2>
      </div>

      <div className="mt-5 grid border border-line bg-panel lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="min-w-0 border-b border-line px-4 pt-5 pb-6 sm:px-6 sm:pt-6 lg:border-r lg:border-b-0">
          <h3 className="text-base font-semibold">Recommended exam order</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Cloud Practitioner is optional. Start with Solutions Architect – Associate, then choose CloudOps for
            platform work or Developer for backend work.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-4">
            <div>
              <dt className="text-sm text-muted">Exams passed</dt>
              <dd className="mt-1 font-display text-2xl leading-none font-bold tabular-nums">{examsPassed} / {examTasks.length}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Checklist steps done</dt>
              <dd className="mt-1 font-display text-2xl leading-none font-bold tabular-nums">{checkedSteps} / {awsTasks.length}</dd>
            </div>
          </dl>

          <div aria-hidden="true" className="mt-4 h-[3px] bg-raised">
            <div
              className="h-full bg-accent motion-safe:transition-[width] motion-safe:duration-500"
              style={{ width: `${(checkedSteps / awsTasks.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="min-w-0 divide-y divide-line">
          {awsModules.map((module) => (
            <StudyModuleDetails key={module.id} module={module} checked={checked} onTaskChange={onTaskChange} />
          ))}
        </div>
      </div>
    </section>
  );
}
