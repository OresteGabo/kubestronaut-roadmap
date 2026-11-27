import { ArrowRight, Check, Circle, CircleDot, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import { roadmapData, type StageId } from "../data/roadmapData";
import {
  filterStages,
  setManualPass,
  setStageNote,
  setTaskChecked,
  type ProgressState,
  type RoadmapProgress,
  type StageFilter,
  type StageStatus,
} from "../lib/progress";
import { updateTracker } from "../lib/useTracker";
import { RoadmapStageCard } from "./RoadmapStageCard";

const filters = [
  { value: "all", label: "All Stages" },
  { value: "remaining", label: "In Progress / Remaining" },
  { value: "completed", label: "Completed" },
] as const satisfies readonly { value: StageFilter; label: string }[];

const emptyMessages: Record<StageFilter, string> = {
  all: "No certification stages are available.",
  remaining: "No steps remaining. You’ve checked off the full roadmap.",
  completed: "No completed stages yet. Record a certification pass to see it here.",
};

const statuses = {
  "not-started": { label: "Not Started", icon: Circle },
  "in-progress": { label: "In Progress", icon: CircleDot },
  completed: { label: "Completed", icon: Check },
} satisfies Record<StageStatus, { label: string; icon: typeof Circle }>;

interface RoadmapTimelineProps {
  readonly summary: RoadmapProgress;
  readonly progress: ProgressState;
}

function stageInLocation(): StageId | undefined {
  if (typeof window === "undefined") return undefined;
  return roadmapData.find(({ id }) => window.location.hash === `#${id}`)?.id;
}

export function RoadmapTimeline({ summary, progress }: RoadmapTimelineProps) {
  const currentStageId = summary.stages.find(({ remainingSteps }) => remainingSteps > 0)?.stage.id;
  const [filter, setFilter] = useState<StageFilter>("all");
  const [linkedStageId] = useState(stageInLocation);
  const [selectedId, setSelectedId] = useState(linkedStageId ?? currentStageId ?? summary.stages[0]?.stage.id);
  const visibleStages = filterStages(summary.stages, filter);
  const selected = visibleStages.find(({ stage }) => stage.id === selectedId) ?? visibleStages[0];

  useEffect(() => {
    if (linkedStageId) document.getElementById(linkedStageId)?.scrollIntoView();

    function selectLinkedStage() {
      const id = stageInLocation();
      if (!id) return;
      setFilter("all");
      setSelectedId(id);
    }

    window.addEventListener("hashchange", selectLinkedStage);
    return () => window.removeEventListener("hashchange", selectLinkedStage);
  }, [linkedStageId]);

  return (
    <section id="roadmap" aria-labelledby="roadmap-heading" className="mt-12 scroll-mt-6 sm:mt-16">
      <div className="mb-5 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
        <h2 id="roadmap-heading" className="font-display text-3xl leading-none font-bold tracking-tight sm:text-4xl">
          Certification roadmap
        </h2>
        <div role="group" aria-label="Filter certification stages" className="flex max-w-full flex-wrap gap-x-4 gap-y-0.5 sm:gap-x-5">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              className={`min-h-11 border-b-2 text-xs font-medium transition-colors motion-reduce:transition-none sm:text-sm ${filter === value ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="grid min-w-0 border-y border-line lg:grid-cols-[16rem_minmax(0,1fr)]">
          <nav aria-label="Certification stages" className="min-w-0 border-b border-line lg:border-r lg:border-b-0">
            <ol role="list" className="grid auto-cols-fr grid-flow-col divide-x divide-line lg:block lg:divide-x-0 lg:divide-y">
              {visibleStages.map(({ stage, checkedSteps, totalSteps, status }) => {
                const active = stage.id === selected.stage.id;
                const { label, icon: StatusIcon } = statuses[status];

                return (
                  <li key={stage.id} className="min-w-0">
                    <a
                      href={`#${stage.id}`}
                      aria-current={active ? "step" : undefined}
                      className={`relative grid min-h-17 justify-items-center gap-1 px-0.5 py-2.5 outline-offset-[-3px]! transition-colors motion-reduce:transition-none lg:min-h-24 lg:justify-items-stretch lg:px-4 lg:py-3.5 ${active ? "bg-accent-wash" : "hover:bg-raised"}`}
                      onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                        event.preventDefault();
                        setSelectedId(stage.id);
                        window.history.replaceState(window.history.state, "", `#${stage.id}`);
                      }}
                    >
                      <span aria-hidden="true" className={`absolute inset-x-0 -top-px h-0.5 lg:inset-y-0 lg:-left-px lg:h-auto lg:w-0.5 ${active ? "bg-accent" : ""}`} />
                      <span className="flex min-w-0 items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <span aria-hidden="true" className="hidden font-mono text-xs text-muted lg:inline">{String(stage.order).padStart(2, "0")}</span>
                          <span className={`font-mono text-xs leading-tight font-semibold lg:text-sm ${active ? "text-accent" : "text-ink"}`}>{stage.code}</span>
                        </span>
                        {active && <ArrowRight aria-hidden="true" className="hidden size-4 shrink-0 text-accent lg:block" />}
                      </span>
                      <span className="sr-only text-xs leading-snug text-ink lg:not-sr-only">{stage.name}</span>
                      <span className="flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs text-muted lg:justify-between">
                        <span className="inline-flex items-center gap-1.5">
                          <StatusIcon aria-hidden="true" className="size-3 shrink-0" />
                          <span className="sr-only lg:not-sr-only">{label}</span>
                        </span>
                        <span className="whitespace-nowrap tabular-nums">
                          {checkedSteps}/{totalSteps}<span className="sr-only lg:not-sr-only"> steps</span>
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <RoadmapStageCard
            key={selected.stage.id}
            entry={selected}
            current={selected.stage.id === currentStageId}
            totalStages={summary.totalCertifications}
            progress={progress}
            onTaskChange={(taskId, checked) => updateTracker((stored) => ({
              ...stored,
              progress: setTaskChecked(stored.progress, taskId, checked),
            }))}
            onPassChange={(passed) => updateTracker((stored) => ({
              ...stored,
              progress: setManualPass(stored.progress, selected.stage.id, passed),
            }))}
            onNoteChange={(note) => updateTracker((stored) => ({
              ...stored,
              progress: setStageNote(stored.progress, selected.stage.id, note),
            }))}
          />
        </div>
      ) : (
        <p role="status" className="flex items-start gap-3 border-y border-line bg-panel px-5 py-8 text-sm text-muted sm:px-8">
          <ListFilter aria-hidden="true" className="size-4 shrink-0" /> {emptyMessages[filter]}
        </p>
      )}
    </section>
  );
}
