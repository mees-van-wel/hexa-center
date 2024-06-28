export const TIME_FORMATS = {
  AUTO: "AUTO",
  TWELVE: "TWELVE",
  TWENTYFOUR: "TWENTYFOUR",
} as const;

export type TimeFormats = typeof TIME_FORMATS;
export type TimeFormatKey = keyof TimeFormats;
export type TimeFormat = TimeFormats[TimeFormatKey];

export const TIME_FORMAT_KEYS = Object.keys(TIME_FORMATS) as TimeFormatKey[];
export const TIME_FORMAT_VALUES = Object.values(TIME_FORMATS) as TimeFormat[];
export const DEFAULT_TIME_FORMAT = TIME_FORMATS.AUTO;
