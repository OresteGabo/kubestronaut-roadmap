"use client";

import { ArrowDownRight, ArrowUpRight, Asterisk, CalendarDays, Moon, Sun } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import astronaut from "../app/assets/astronaut.webp";
import type { LearningTaskId } from "../data/learningData";
import { parseCalendarDate } from "../lib/calendarDate";
import { getRoadmapProgress, setTargetStartDate } from "../lib/progress";
import { updateTracker, useTracker } from "../lib/useTracker";
import { DashboardSummary } from "./DashboardSummary";
import { FurtherStudy } from "./FurtherStudy";
import { RoadmapTimeline } from "./RoadmapTimeline";
import { TrackerBackupControls } from "./TrackerBackupControls";

const learningTracks = [
  { href: "#roadmap", label: "Kubernetes" },
  { href: "#aws", label: "AWS certifications" },
] as const;

function changeLearningTask(id: LearningTaskId, checked: boolean) {
  updateTracker((current) => {
    const ids = current.learningCheckedTaskIds;
    if (ids.includes(id) === checked) return current;

    return {
      ...current,
      learningCheckedTaskIds: checked ? [...ids, id] : ids.filter((taskId) => taskId !== id),
    };
  });
}

export function Tracker({ children }: { readonly children: ReactNode }) {
  const { data, today, storage } = useTracker();
  const { progress, theme } = data;
  const summary = today === null ? null : getRoadmapProgress(progress, today);
  const themeAction = theme === "dark" ? "Use light theme" : "Use dark theme";

  return (
    <div data-theme={theme} className="min-h-dvh bg-canvas font-sans text-ink">
      <header className="border-b border-line">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 px-4 sm:px-8 md:min-h-17 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-h-17 items-center gap-2.5 font-display text-base font-bold tracking-tight sm:text-lg">
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
              <Asterisk strokeWidth={2.2} className="size-5" />
            </span>
            Kubestronaut
          </div>
          <nav aria-label="Certification roadmaps" className="col-span-2 row-start-2 flex w-full flex-wrap items-center gap-x-5 border-t border-line text-sm font-medium text-muted md:col-span-1 md:row-start-1 md:w-auto md:gap-x-6 md:border-none">
            {learningTracks.map(({ href, label }) => (
              <a key={href} href={href} className="inline-flex min-h-11 items-center hover:text-accent">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-4">
            <a
              href="https://orestegabo.dev"
              className="inline-flex min-h-11 items-center gap-1.5 px-1 text-xs font-medium text-muted hover:text-ink sm:text-sm"
            >
              <span className="sm:hidden">Portfolio</span>
              <span className="hidden sm:inline">orestegabo.dev</span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
            <button
              type="button"
              disabled={summary === null}
              aria-label={themeAction}
              title={themeAction}
              className="grid size-11 place-items-center rounded-full border border-line text-ink hover:border-accent-line hover:bg-raised disabled:opacity-50"
              onClick={() => updateTracker((current) => ({
                ...current,
                theme: current.theme === "dark" ? "light" : "dark",
              }))}
            >
              {theme === "dark" ? <Sun aria-hidden="true" className="size-4.5" /> : <Moon aria-hidden="true" className="size-4.5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-4 pb-14 sm:px-8 sm:pt-8 sm:pb-20">
        <section aria-labelledby="roadmap-introduction" className="relative isolate overflow-hidden rounded-2xl bg-[#181411] text-[#fff5e8] sm:rounded-3xl">
          <div className="pointer-events-none relative aspect-[2.1] overflow-hidden sm:absolute sm:inset-y-0 sm:right-0 sm:aspect-auto sm:w-[75%]">
            <Image
              src={astronaut}
              alt=""
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 639px) 100vw, (max-width: 1280px) 72vw, 915px"
              className="object-cover object-[right_42%] sm:object-[61%_center]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#181411] via-transparent via-38% sm:bg-linear-to-r sm:from-[#181411] sm:via-[#181411]/20 sm:via-45% sm:to-transparent" />
          </div>

          <div className="relative -mt-4 px-5 pt-1 pb-7 sm:mt-0 sm:flex sm:min-h-[29rem] sm:flex-col sm:items-start sm:justify-center sm:px-9 sm:py-10 lg:min-h-[30.5rem] lg:px-13">
            <p className="mb-4 font-mono text-[0.66rem] font-medium tracking-[0.15em] text-[#ffab8d] uppercase sm:mb-5 sm:text-xs">
              CNCF certification tracker
            </p>
            <h1 id="roadmap-introduction" className="max-w-[9em] font-display text-[clamp(2.35rem,7.2vw,4.95rem)] leading-[0.94] font-bold tracking-[-0.07em]">
              Kubernetes certification roadmap<span className="text-[#ff8d6a]">.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#ddd0c4] sm:mt-5 sm:text-base">
              Plan your study and track exam passes across the five core CNCF Kubernetes certifications.
            </p>
            <a
              href="#roadmap"
              className="mt-5 inline-flex min-h-11 items-center justify-between gap-3 rounded-full bg-[#ff8d6a] px-4 text-sm font-semibold text-[#22130e] hover:bg-[#ffad93] focus-visible:outline-[#ffab8d]! sm:mt-7 sm:min-h-12 sm:px-5"
            >
              {summary && summary.checkedSteps > 0 ? "Continue studying" : "View study plan"}
              <ArrowDownRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </section>

        {summary === null ? (
          <p role="status" className="mt-5 text-sm text-muted">Loading tracker…</p>
        ) : (
          <>
            <DashboardSummary summary={summary} />
            <div className="mt-4 flex flex-wrap items-start justify-between gap-x-5 gap-y-2.5">
              <label className="flex min-h-11 flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-medium text-muted">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-accent" /> Target start date
                </span>
                <input
                  type="date"
                  className="min-h-11 min-w-0 rounded-md border border-line bg-panel px-2.5 font-mono text-sm text-ink hover:border-accent-line"
                  value={summary.startDate}
                  onChange={(event) => {
                    const date = parseCalendarDate(event.currentTarget.value);
                    updateTracker((current) => ({
                      ...current,
                      progress: setTargetStartDate(current.progress, date),
                    }));
                  }}
                />
              </label>
              <TrackerBackupControls data={data} storage={storage} />
            </div>
            <RoadmapTimeline summary={summary} progress={progress} />
          </>
        )}
        {children}
        <FurtherStudy checkedTaskIds={data.learningCheckedTaskIds} onTaskChange={changeLearningTask} />
      </main>
    </div>
  );
}
