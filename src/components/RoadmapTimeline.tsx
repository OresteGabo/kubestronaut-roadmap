import { ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import type { StageId } from "../data/roadmapData";
import {
  filterStages,
  setManualPass,
  setStageNote,
  setTaskChecked,
  type ProgressState,
  type RoadmapProgress,
  type StageFilter,
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

interface RoadmapTimelineProps {
  readonly summary: RoadmapProgress;
  readonly progress: ProgressState;
}

export function RoadmapTimeline({ summary, progress }: RoadmapTimelineProps) {
  const currentStageId = summary.stages.find(({ remainingSteps }) => remainingSteps > 0)?.stage.id;
  const [filter, setFilter] = useState<StageFilter>("all");
  // The timeline mounts after the browser has restored progress.
  const [linkedStageId] = useState(() => summary.stages.find(({ stage }) =>
    window.location.hash === `#${stage.id}`,
  )?.stage.id);
  const [openStages, setOpenStages] = useState<ReadonlySet<StageId>>(() => {
    const first = linkedStageId ?? currentStageId;
    return new Set(first ? [first] : []);
  });
  const visibleStages = filterStages(summary.stages, filter);

  useEffect(() => {
    // A direct URL can reach the browser before the asynchronously loaded stages exist.
    if (linkedStageId) document.getElementById(linkedStageId)?.scrollIntoView();
  }, [linkedStageId]);

  function setStageOpen(id: StageId, open: boolean) {
    setOpenStages((current) => {
      if (current.has(id) === open) return current;
      const next = new Set(current);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <section aria-labelledby="roadmap-heading" className="mt-8 sm:mt-10">
      <div className="mb-4 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <h2 id="roadmap-heading" className="text-xl font-semibold tracking-tight">Certification stages</h2>
        <div role="group" aria-label="Filter certification stages" className="flex flex-wrap gap-1 rounded-lg border border-line bg-panel p-1">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              className={`min-h-9 rounded-md border px-2.5 text-xs font-medium sm:px-3 sm:text-sm ${filter === value ? "border-line bg-raised text-ink" : "border-transparent text-muted hover:bg-raised/50 hover:text-ink"}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visibleStages.length === 0 ? (
        <p role="status" className="flex items-start gap-2.5 rounded-lg border border-dashed border-line bg-panel p-5 text-sm text-muted">
          <ListFilter aria-hidden="true" className="size-4 shrink-0" /> {emptyMessages[filter]}
        </p>
      ) : (
        <ol role="list" className="space-y-3">
          {visibleStages.map((entry) => {
            const { id } = entry.stage;
            const current = id === currentStageId;

            return (
              <li key={id} className="relative pl-5 before:absolute before:top-6 before:-bottom-9 before:left-1.5 before:w-px before:bg-line last:before:hidden sm:pl-7">
                <span
                  aria-hidden="true"
                  className={`absolute top-5 left-0 size-3 rounded-full border ${current ? "border-accent bg-accent-wash" : "border-line bg-canvas"}`}
                />
                <RoadmapStageCard
                  entry={entry}
                  current={current}
                  isOpen={openStages.has(id)}
                  onOpenChange={(open) => setStageOpen(id, open)}
                  totalStages={summary.totalCertifications}
                  progress={progress}
                  onTaskChange={(taskId, checked) => updateTracker((stored) => ({
                    ...stored,
                    progress: setTaskChecked(stored.progress, taskId, checked),
                  }))}
                  onPassChange={(passed) => updateTracker((stored) => ({
                    ...stored,
                    progress: setManualPass(stored.progress, id, passed),
                  }))}
                  onNoteChange={(note) => updateTracker((stored) => ({
                    ...stored,
                    progress: setStageNote(stored.progress, id, note),
                  }))}
                />
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
