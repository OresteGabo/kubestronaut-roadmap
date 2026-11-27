import { ArrowUpRight, ChevronDown, Info } from "lucide-react";
import { Tracker } from "../components/Tracker";
import { kubestronautProgram } from "../data/roadmapData";

const programDateFormat = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" });

export default function Home() {
  const { additionalRequirement, eligibility, maintenance, resources } = kubestronautProgram;
  const effectiveDate = programDateFormat.format(new Date(`${additionalRequirement.effectiveOn}T00:00:00Z`));

  return (
    <Tracker>
      <details className="group/eligibility mt-10 border-y border-line sm:mt-14">
        <summary className="flex min-h-13 cursor-pointer list-none items-center gap-3 px-1 py-2 text-sm hover:text-accent sm:px-3 [&::-webkit-details-marker]:hidden">
          <Info aria-hidden="true" className="size-4 shrink-0 text-accent" />
          <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 text-sm">
            <span className="font-medium">Kubestronaut eligibility</span>
            <span className="text-muted">
              {additionalRequirement.code} required from <time dateTime={additionalRequirement.effectiveOn}>{effectiveDate}</time>
            </span>
          </span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted group-open/eligibility:rotate-180 motion-safe:transition-transform" />
        </summary>
        <div className="max-w-4xl space-y-3 px-1 pt-1 pb-5 text-sm leading-relaxed text-muted sm:px-3">
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
