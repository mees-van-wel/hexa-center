export const WEEKDAYS = {
  SUNDAY: "SUNDAY",
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
} as const;

export type Weekdays = typeof WEEKDAYS;
export type WeekdayKey = keyof Weekdays;
export type Weekday = Weekdays[WeekdayKey];

export const WEEKDAY_KEYS = Object.keys(WEEKDAYS) as WeekdayKey[];
export const WEEKDAY_VALUES = Object.values(WEEKDAYS) as Weekday[];
