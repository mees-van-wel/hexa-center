export const CALENDAR_VIEWS = {
  WEEK: "WEEK",
  WORKWEEK: "WORKWEEK",
  DAY: "DAY",
} as const;

export type CalendarViews = typeof CALENDAR_VIEWS;
export type CalendarViewKeys = keyof CalendarViews;
export type CalendarView = CalendarViews[CalendarViewKeys];

export const CALENDAR_VIEW_KEYS = Object.keys(
  CALENDAR_VIEWS,
) as CalendarViewKeys[];
export const CALENDAR_VIEW_VALUES = Object.values(
  CALENDAR_VIEWS,
) as CalendarView[];
