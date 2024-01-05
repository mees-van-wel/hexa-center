export const CALENDARVIEW = {
  WEEK: "WEEK",
  WORKWEEK: "WORKWEEK",
  DAY: "DAY",
} as const;

export type CalendarViews = typeof CALENDARVIEW;
export type CalendarViewKeys = keyof CalendarViews;
export type CalendarView = CalendarViews[CalendarViewKeys];

export const CALENDARVIEW_KEYS = Object.keys(
  CALENDARVIEW,
) as CalendarViewKeys[];
export const CALENDARVIEW_VALUES = Object.values(
  CALENDARVIEW,
) as CalendarView[];
