import { Download, RotateCcw, Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { getLocalCalendarDate } from "../lib/calendarDate";
import { createProgressState } from "../lib/progress";
import { readTrackerData, serializeTrackerBackup, type TrackerData } from "../lib/trackerStorage";
import { updateTracker } from "../lib/useTracker";

interface TrackerBackupControlsProps {
  readonly data: TrackerData;
  readonly storage: ReturnType<typeof updateTracker>;
}

const actionClass =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm px-2 text-xs font-medium whitespace-nowrap text-muted hover:bg-raised hover:text-ink disabled:opacity-50 sm:gap-2 sm:px-3 sm:text-sm";

export function TrackerBackupControls({ data, storage }: TrackerBackupControlsProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState("");
  const [importing, setImporting] = useState(false);

  function exportBackup() {
    const now = new Date();
    const blob = new Blob([serializeTrackerBackup(data, now)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kubestronaut-roadmap-${getLocalCalendarDate(now)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback("JSON backup exported.");
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    setImporting(true);
    try {
      let contents: string;
      try {
        contents = await file.text();
      } catch {
        setFeedback("Import failed. The backup file could not be read.");
        return;
      }

      const result = readTrackerData(contents, "backup");
      if (!result.ok) {
        setFeedback(`Import failed. ${result.message}`);
        return;
      }
      if (!window.confirm("Replace your tracker data with this JSON backup?")) {
        setFeedback("Import canceled. Your tracker data was kept.");
        return;
      }

      const status = updateTracker(() => result.data, true);
      const imported = status === "available" ? "Backup imported." : "Backup imported in this tab.";
      const skipped = result.retiredIdCount === 0 ? "" :
        ` Skipped ${result.retiredIdCount} retired roadmap ${result.retiredIdCount === 1 ? "ID" : "IDs"}.`;
      setFeedback(imported + skipped);
    } finally {
      setImporting(false);
    }
  }

  function resetProgress() {
    if (!window.confirm("Reset all checklist progress, pass overrides, notes, and the start date?")) {
      setFeedback("Reset canceled. Your progress was kept.");
      return;
    }

    const status = updateTracker((current) => ({ ...current, progress: createProgressState() }), true);
    setFeedback(status === "available" ? "Progress reset." : "Progress reset in this tab.");
  }

  return (
    <div className="min-w-0 max-w-md">
      <div role="group" aria-label="Progress backup" className="-mx-2 flex flex-wrap sm:-mx-3 lg:justify-end">
        <button type="button" className={actionClass} onClick={exportBackup}>
          <Download aria-hidden="true" className="size-4" /> Export JSON
        </button>
        <button type="button" className={actionClass} disabled={importing} onClick={() => fileInput.current?.click()}>
          <Upload aria-hidden="true" className="size-4" /> Import JSON
        </button>
        <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={importBackup} />
        <button type="button" className={actionClass} disabled={importing} onClick={resetProgress}>
          <RotateCcw aria-hidden="true" className="size-4" /> Reset Progress
        </button>
      </div>
      <div className="text-sm text-muted lg:text-right">
        {storage === "unavailable" && (
          <p className="mt-2" role="alert">Changes could not be saved on this device. Export a JSON backup to keep them.</p>
        )}
        {storage === "unreadable" && (
          <p className="mt-2" role="alert">Saved tracker data could not be restored. Changes stay in this tab until you import a backup or reset progress.</p>
        )}
        <p className={feedback ? "mt-2" : undefined} role="status">{feedback}</p>
      </div>
    </div>
  );
}
