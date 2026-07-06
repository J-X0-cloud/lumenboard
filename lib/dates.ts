import { addDays, addMonths, format, startOfMonth } from "date-fns";

/** Monday = 0 … Sunday = 6. */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** First day of the month `back` months before `date`'s month. */
export function monthStart(date: Date, back = 0): Date {
  return startOfMonth(addMonths(date, -back));
}

export function monthEnd(date: Date, back = 0): Date {
  return addDays(monthStart(date, back - 1), -1);
}

export function isSameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export const fmt = {
  day: (d: Date) => format(d, "MMM d"),
  weekdayDay: (d: Date) => format(d, "EEE d"),
  full: (d: Date) => format(d, "EEE, MMM d, yyyy"),
  weekdayShort: (d: Date) => format(d, "EEE, MMM d"),
  long: (d: Date) => format(d, "MMM d, yyyy"),
  month: (d: Date) => format(d, "MMM"),
  monthYear: (d: Date) => format(d, "MMM yyyy"),
  monthLong: (d: Date) => format(d, "MMMM yyyy"),
};
