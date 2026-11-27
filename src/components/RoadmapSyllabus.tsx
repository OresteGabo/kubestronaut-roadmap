import { ChevronDown } from "lucide-react";
import type { StageId, SyllabusDomain } from "../data/roadmapData";

interface RoadmapSyllabusProps {
  readonly stageId: StageId;
  readonly domains: readonly SyllabusDomain[];
}

export function RoadmapSyllabus({ stageId, domains }: RoadmapSyllabusProps) {
  const headingId = `${stageId}-syllabus`;

  return (
    <section aria-labelledby={headingId} className="min-w-0">
      <h3 id={headingId} className="mb-3 text-sm font-semibold">Syllabus breakdown</h3>
      <div className="space-y-2">
        {domains.map(({ id, name, weightPercent, topics, suggestedPractice }) => (
          <details key={id} className="group/domain rounded-md border border-line bg-canvas">
            <summary className="grid min-h-12 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-3 gap-y-2 rounded-md px-3 py-2.5 text-sm hover:bg-raised/50 [&::-webkit-details-marker]:hidden">
              <span className="font-medium">{name}</span>
              <span className="font-mono text-xs text-muted tabular-nums">{weightPercent}%</span>
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 text-muted group-open/domain:rotate-180 motion-safe:transition-transform"
              />
              <span aria-hidden="true" className="col-span-full h-1 overflow-hidden rounded-full bg-raised">
                <span className="block h-full rounded-full bg-accent/70" style={{ width: `${weightPercent}%` }} />
              </span>
            </summary>
            <div className="space-y-3 border-t border-line px-3 py-3 text-sm text-muted">
              <ul className="list-disc space-y-1.5 pl-4">
                {topics.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
              {suggestedPractice && (
                <>
                  <p className="font-medium text-ink">Suggested practice</p>
                  <ul className="list-disc space-y-1.5 pl-4">
                    {suggestedPractice.map((topic) => <li key={topic}>{topic}</li>)}
                  </ul>
                </>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
