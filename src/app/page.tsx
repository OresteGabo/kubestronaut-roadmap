import { ArrowUpRight, ChevronDown, Info } from "lucide-react";
import { Tracker } from "../components/Tracker";
import { kubestronautProgram } from "../data/roadmapData";

const programDateFormat = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" });

export default function Home() {
  const { additionalRequirement, eligibility, maintenance, resources } = kubestronautProgram;
  const effectiveDate = programDateFormat.format(new Date(`${additionalRequirement.effectiveOn}T00:00:00Z`));

  return (
    <Tracker>
      <details className="group/eligibility mt-3 rounded-lg border border-line bg-panel">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-raised/45 sm:px-4 [&::-webkit-details-marker]:hidden">
          <Info aria-hidden="true" className="size-4 shrink-0 text-accent" />
          <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 text-sm">
            <span className="font-medium">Kubestronaut eligibility</span>
            <span className="text-muted">
              {additionalRequirement.code} required from <time dateTime={additionalRequirement.effectiveOn}>{effectiveDate}</time>
            </span>
          </span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted group-open/eligibility:rotate-180 motion-safe:transition-transform" />
        </summary>
        <div className="space-y-2 border-t border-line px-4 py-3 text-sm leading-relaxed text-muted">
          <p>{eligibility}</p>
          <p>{maintenance}</p>
          <ul role="list" className="flex flex-wrap gap-x-4 gap-y-1">
            {[...resources, { href: additionalRequirement.href, label: additionalRequirement.name }].map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="inline-flex items-center gap-1.5 rounded-sm text-accent hover:underline">
                  {label}<ArrowUpRight aria-hidden="true" className="size-3 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </Tracker>
  );
}
