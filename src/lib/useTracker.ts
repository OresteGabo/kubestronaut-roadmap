"use client";

import { useSyncExternalStore } from "react";
import { getLocalCalendarDate, type CalendarDate } from "./calendarDate";
import {
  createTrackerData,
  readTrackerData,
  serializeTracker,
  TRACKER_STORAGE_KEY,
  type TrackerData,
} from "./trackerStorage";

interface TrackerSnapshot {
  readonly data: TrackerData;
  readonly today: CalendarDate | null;
  readonly storage: "available" | "unavailable" | "unreadable";
}

type StoredTracker = Pick<TrackerSnapshot, "data" | "storage">;

const serverSnapshot: TrackerSnapshot = {
  data: createTrackerData(),
  today: null,
  storage: "available",
};

let snapshot = serverSnapshot;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("storage", syncFromStorage);
    if (snapshot.storage === "available") publish(readStoredTracker());
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", syncFromStorage);
  };
}

function publish(next: StoredTracker) {
  snapshot = { ...next, today: getLocalCalendarDate(new Date()) };
  listeners.forEach((listener) => listener());
}

function readStoredTracker(): StoredTracker {
  let saved: string | null;
  try {
    saved = window.localStorage.getItem(TRACKER_STORAGE_KEY);
  } catch {
    return { data: snapshot.data, storage: "unavailable" };
  }

  if (saved === null) return { data: createTrackerData(), storage: "available" };

  const result = readTrackerData(saved, "storage");
  return result.ok
    ? { data: result.data, storage: "available" }
    : { data: snapshot.data, storage: "unreadable" };
}

function syncFromStorage(event: StorageEvent) {
  // Protect any edits that exist only in this tab after a failed save.
  if (snapshot.storage !== "available") return;
  if (event.key === TRACKER_STORAGE_KEY || event.key === null) publish(readStoredTracker());
}

export function useTracker(): TrackerSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);
}

export function updateTracker(
  update: (data: TrackerData) => TrackerData,
  replaceUnreadable = false,
): TrackerSnapshot["storage"] {
  // Apply a field edit to the latest stored record even if its storage event is still queued.
  const latest = snapshot.storage === "available" ? readStoredTracker() : snapshot;
  const data = update(latest.data);
  let storage = latest.storage;

  // Keep unreadable saved data intact until a confirmed reset or import.
  if (storage !== "unreadable" || replaceUnreadable) {
    try {
      window.localStorage.setItem(TRACKER_STORAGE_KEY, serializeTracker(data));
      storage = "available";
    } catch {
      if (storage !== "unreadable") storage = "unavailable";
    }
  }

  publish({ data, storage });
  return storage;
}
