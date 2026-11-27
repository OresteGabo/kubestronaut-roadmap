import { CalendarDays, CircleCheck, Clock3, ListChecks } from "lucide-react";
import { parseCalendarDate, type CalendarDate } from "../lib/calendarDate";
import type { RoadmapProgress } from "../lib/progress";

interface DashboardSummaryProps {
  readonly summary: RoadmapProgress;
  readonly onDateChange: (date: CalendarDate | null) => void;
}

const estimateNumber = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });

function formatRange({ min, max }: { min: number; max: number }) {
  const minimum = estimateNumber.format(min);
  const maximum = estimateNumber.format(max);
  return minimum === maximum ? minimum : `${minimum}–${maximum}`;
}

export function DashboardSummary({ summary, onDateChange }: DashboardSummaryProps) {
  const percent = Math.round(summary.completionPercent);

  return (
    <section aria-labelledby="completion-heading" className="overflow-hidden rounded-xl border border-line bg-panel">
      <div className="bg-linear-to-r from-accent-wash/70 to-transparent p-5 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 id="completion-heading" className="text-sm font-semibold">Overall completion</h2>
          <span className="font-mono text-2xl font-semibold tracking-tight text-accent tabular-nums">{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-labelledby="completion-heading"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-2 overflow-hidden rounded-full bg-raised ring-1 ring-line"
        >
          <div
            className="h-full rounded-full bg-accent motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out"
            style={{ width: `${summary.completionPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-[1fr_1fr_1.2fr_1fr]">
        <div className="min-w-0 bg-panel px-4 py-4 sm:px-6">
          <p className="flex items-center gap-2 text-sm text-muted">
            <ListChecks aria-hidden="true" className="size-4 shrink-0" /> Steps done
          </p>
          <p className="mt-2 font-mono text-xl font-semibold tabular-nums">
            {summary.checkedSteps} <span className="text-muted">/ {summary.totalSteps}</span>
            <span className="sr-only"> steps done</span>
          </p>
        </div>
        <div className="min-w-0 bg-panel px-4 py-4 sm:px-6">
          <p className="flex items-center gap-2 text-sm text-muted">
            <CircleCheck aria-hidden="true" className="size-4 shrink-0" /> Certs passed
          </p>
          <p className="mt-2 font-mono text-xl font-semibold tabular-nums">
            {summary.certificationsPassed} <span className="text-muted">/ {summary.totalCertifications}</span>
            <span className="sr-only"> certs passed</span>
          </p>
        </div>
        <div className="col-span-2 min-w-0 bg-panel px-4 py-4 sm:col-span-1 sm:px-6">
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock3 aria-hidden="true" className="size-4 shrink-0" /> Estimated study left
          </p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-3 font-mono text-lg font-semibold tabular-nums">
            <span>{formatRange(summary.remainingStudy.weeks)} <span className="text-sm font-normal text-muted">weeks</span></span>
            <span>{formatRange(summary.remainingStudy.hours)} <span className="text-sm font-normal text-muted">hours</span></span>
          </p>
        </div>
        <div className="col-span-2 min-w-0 bg-panel px-4 py-4 sm:col-span-1 sm:px-6">
          <label className="grid gap-2 text-sm text-muted">
            <span className="flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="size-4 shrink-0" /> Target start date
            </span>
            <input
              type="date"
              className="w-full min-w-0 rounded-md border border-line bg-canvas px-2.5 py-1.5 font-mono text-ink"
              value={summary.startDate}
              onChange={(event) => onDateChange(parseCalendarDate(event.currentTarget.value))}
            />
          </label>
        </div>
      </div>
    </section>
  );
}
