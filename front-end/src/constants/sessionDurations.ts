export const SESSION_DURATIONS = {
  SESSION: "SESSION",
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
} as const;

export type SessionDurations = typeof SESSION_DURATIONS;
export type SessionDurationKey = keyof SessionDurations;
export type SessionDuration = SessionDurations[SessionDurationKey];

export const SESSION_DURATION_KEYS = Object.keys(
  SESSION_DURATIONS,
) as SessionDurationKey[];
export const SESSION_DURATION_VALUES = Object.values(
  SESSION_DURATIONS,
) as SessionDuration[];

export const DEFAULT_SESSION_DURATION = SESSION_DURATIONS.SESSION;
