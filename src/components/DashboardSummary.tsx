import type { RoadmapProgress } from "../lib/progress";

const estimateNumber = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });

function formatRange({ min, max }: { min: number; max: number }) {
  const minimum = estimateNumber.format(min);
  const maximum = estimateNumber.format(max);
  return minimum === maximum ? minimum : `${minimum}–${maximum}`;
}

export function DashboardSummary({ summary }: { readonly summary: RoadmapProgress }) {
  const percent = Math.round(summary.completionPercent);

  return (
    <section aria-labelledby="completion-heading" className="mt-5 grid border-y border-line sm:mt-7 lg:grid-cols-[1.3fr_3fr]">
      <div className="border-b border-line py-5 lg:border-r lg:border-b-0 lg:py-6 lg:pr-7">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="completion-heading" className="text-sm font-medium text-muted">Overall completion</h2>
          <span className="font-display text-4xl leading-none font-semibold tracking-[-0.07em] text-accent tabular-nums">{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-labelledby="completion-heading"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised ring-1 ring-line"
        >
          <div
            className="h-full rounded-full bg-accent motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out"
            style={{ width: `${summary.completionPercent}%` }}
          />
        </div>
      </div>
      <dl className="grid grid-cols-[1fr_1fr] sm:grid-cols-[0.9fr_0.9fr_1.5fr]">
        <div className="min-w-0 py-4 sm:pr-5 lg:px-6 lg:py-6">
          <dt className="text-sm text-muted">Steps done</dt>
          <dd className="mt-1 font-display text-2xl leading-none font-semibold tracking-tight tabular-nums sm:text-3xl">
            {summary.checkedSteps} <span className="font-normal text-muted">/ {summary.totalSteps}</span>
            <span className="sr-only"> steps done</span>
          </dd>
        </div>
        <div className="min-w-0 border-l border-line py-4 pl-4 sm:px-5 lg:px-6 lg:py-6">
          <dt className="text-sm text-muted">Certs passed</dt>
          <dd className="mt-1 font-display text-2xl leading-none font-semibold tracking-tight tabular-nums sm:text-3xl">
            {summary.certificationsPassed} <span className="font-normal text-muted">/ {summary.totalCertifications}</span>
            <span className="sr-only"> certs passed</span>
          </dd>
        </div>
        <div className="col-span-2 min-w-0 border-t border-line py-4 sm:col-span-1 sm:border-t-0 sm:border-l sm:pl-5 lg:py-6 lg:pl-6">
          <dt className="text-sm text-muted">Estimated study left</dt>
          <dd className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display text-2xl leading-none font-semibold tracking-tight tabular-nums sm:text-3xl">
            <span className="whitespace-nowrap">{formatRange(summary.remainingStudy.weeks)} <span className="text-sm font-normal tracking-normal text-muted">weeks</span></span>
            <span className="whitespace-nowrap">{formatRange(summary.remainingStudy.hours)} <span className="text-sm font-normal tracking-normal text-muted">hours</span></span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
