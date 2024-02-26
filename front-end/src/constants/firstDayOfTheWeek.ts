import { WEEKDAYS } from "./weekdays";
export const FIRST_DAYS_OF_THE_WEEK = {
  AUTO: "AUTO",
  ...WEEKDAYS,
} as const;

export type FirstDaysOfTheWeek = typeof FIRST_DAYS_OF_THE_WEEK;
export type FirstDayOfTheWeekKey = keyof FirstDaysOfTheWeek;
export type FirstDayOfTheWeek = FirstDaysOfTheWeek[FirstDayOfTheWeekKey];

export const FIRST_DAY_OF_THE_WEEK_KEYS = Object.keys(
  FIRST_DAYS_OF_THE_WEEK,
) as FirstDayOfTheWeekKey[];
export const FIRST_DAY_OF_THE_WEEK_VALUES = Object.values(
  FIRST_DAYS_OF_THE_WEEK,
) as FirstDayOfTheWeek[];
export const DEFAULT_FIRST_DAY_OF_THE_WEEK = FIRST_DAYS_OF_THE_WEEK.AUTO;
