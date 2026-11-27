"use client";

import { ArrowUpRight, Moon, Orbit, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { getRoadmapProgress, setTargetStartDate } from "../lib/progress";
import { updateTracker, useTracker } from "../lib/useTracker";
import { DashboardSummary } from "./DashboardSummary";
import { RoadmapTimeline } from "./RoadmapTimeline";
import { TrackerBackupControls } from "./TrackerBackupControls";

export function Tracker({ children }: { readonly children: ReactNode }) {
  const { data, today, storage } = useTracker();
  const { progress, theme } = data;
  const summary = today === null ? null : getRoadmapProgress(progress, today);
  const themeAction = theme === "dark" ? "Use light theme" : "Use dark theme";

  return (
    <div data-theme={theme} className="min-h-dvh bg-canvas font-sans text-ink">
      <header className="border-b border-line bg-panel">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:flex-nowrap sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-accent-line bg-accent-wash text-accent">
              <Orbit aria-hidden="true" className="size-5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Kubestronaut</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a
              href="https://orestegabo.dev"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-sm text-muted hover:text-accent"
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
              className="grid size-10 place-items-center rounded-lg border border-line text-muted hover:bg-raised hover:text-ink disabled:opacity-50"
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

      <main className="mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 sm:pt-11">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Kubestronaut Roadmap</h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Plan your study and track progress across the five core CNCF Kubernetes certifications.
            </p>
          </div>
          {summary && <TrackerBackupControls data={data} storage={storage} />}
        </div>

        {summary === null ? <p role="status" className="text-sm text-muted">Loading tracker…</p> : (
          <DashboardSummary
            summary={summary}
            onDateChange={(date) => updateTracker((current) => ({
              ...current,
              progress: setTargetStartDate(current.progress, date),
            }))}
          />
        )}

        {children}
        {summary && <RoadmapTimeline summary={summary} progress={progress} />}
      </main>
    </div>
  );
}
