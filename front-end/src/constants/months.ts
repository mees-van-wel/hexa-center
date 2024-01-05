export const MONTHS = {
  JANUARY: "JANUARY",
  FEBRUARY: "FEBRUARY",
  MARCH: "MARCH",
  APRIL: "APRIL",
  MAY: "MAY",
  JUNE: "JUNE",
  JULY: "JULY",
  AUGUST: "AUGUST",
  SEPTEMBER: "SEPTEMBER",
  OCTOBER: "OCTOBER",
  NOVEMBER: "NOVEMBER",
  DECEMBER: "DECEMBER",
} as const;

export type Months = typeof MONTHS;
export type MonthKeys = keyof Months;
export type Month = Months[MonthKeys];

export const MONTH_KEYS = Object.keys(MONTHS) as MonthKeys[];
export const MONTH_VALUES = Object.values(MONTHS) as Month[];
