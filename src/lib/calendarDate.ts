/** A local calendar date in YYYY-MM-DD form, independent of time and time zone. */
export type CalendarDate = string & { readonly __calendarDate: unique symbol };

export function parseCalendarDate(value: string): CalendarDate | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000-")) return null;

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return null;
  }

  return value as CalendarDate;
}

/** Pass the current Date at the call site to use the viewer's local today. */
export function getLocalCalendarDate(date: Date): CalendarDate {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` as CalendarDate;
}

export function addCalendarDays(date: CalendarDate, days: number): CalendarDate {
  // UTC represents the calendar fields here so adding a day ignores DST.
  const calendar = new Date(`${date}T00:00:00Z`);
  calendar.setUTCDate(calendar.getUTCDate() + days);
  return calendar.toISOString().split("T")[0] as CalendarDate;
}
