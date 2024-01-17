export const EXCEPTIONS = {
  AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",
  AUTH_SESSION_NOT_FOUND: "AUTH_SESSION_NOT_FOUND",
  AUTH_MISSING_TOKEN: "AUTH_MISSING_TOKEN",
  DB_KEY_CONSTRAINT: "DB_KEY_CONSTRAINT",
  DB_UNIQUE_CONSTRAINT: "DB_UNIQUE_CONSTRAINT",
} as const;

export type Exceptions = typeof EXCEPTIONS;
export type ExceptionKey = keyof Exceptions;
export type Exception = Exceptions[ExceptionKey];

export const EXCEPTION_KEYS = Object.keys(EXCEPTIONS) as ExceptionKey[];
export const EXCEPTION_VALUES = Object.values(EXCEPTIONS) as Exception[];
