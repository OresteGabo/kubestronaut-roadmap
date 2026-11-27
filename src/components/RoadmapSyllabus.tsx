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
      <h4 id={headingId} className="text-lg font-semibold tracking-tight">Syllabus breakdown</h4>
      <div className="mt-2.5 flex items-center justify-between gap-3 text-xs text-muted">
        <span>{domains.length} domains</span>
        <span className="font-mono">Exam weight</span>
      </div>
      <div className="mt-2.5 divide-y divide-line border-y border-line">
        {domains.map(({ id, name, weightPercent, topics, suggestedPractice }) => (
          <details key={id} id={id} className="group/domain">
            <summary className="grid min-h-12 cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2.5 gap-y-2 py-3 text-sm hover:text-accent [&::-webkit-details-marker]:hidden">
              <span className="font-medium leading-snug">{name}</span>
              <span className="font-mono text-xs text-accent tabular-nums">{weightPercent}%</span>
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 text-muted group-open/domain:rotate-180 motion-safe:transition-transform"
              />
              <span aria-hidden="true" className="col-span-full h-[2px] overflow-hidden bg-raised">
                <span className="block h-full bg-accent/75" style={{ width: `${weightPercent}%` }} />
              </span>
            </summary>
            <div className="space-y-3 pb-4 text-sm leading-relaxed text-muted">
              <ul className="list-disc space-y-1.5 pl-4 marker:text-accent">
                {topics.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
              {suggestedPractice && (
                <>
                  <p className="font-medium text-ink">Suggested practice</p>
                  <ul className="list-disc space-y-1.5 pl-4 marker:text-accent">
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
