export const DATE_FORMATS = {
  AUTO: "AUTO",
  DMY: "DMY",
  MDY: "MDY",
} as const;

export type DateFormats = typeof DATE_FORMATS;
export type DateFormatKey = keyof DateFormats;
export type DateFormat = DateFormats[DateFormatKey];

export const DATE_FORMAT_KEYS = Object.keys(DATE_FORMATS) as DateFormatKey[];
export const DATE_FORMAT_VALUES = Object.values(DATE_FORMATS) as DateFormat[];
export const DEFAULT_DATE_FORMAT = DATE_FORMATS.AUTO;
