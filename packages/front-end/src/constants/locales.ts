export const LOCALES = {
  EN_US: "en-US",
  NL_NL: "nl-NL",
} as const;

export type Locales = typeof LOCALES;
export type LocaleKey = keyof Locales;
export type Locale = Locales[LocaleKey];

export const LOCALE_KEYS = Object.keys(LOCALES) as LocaleKey[];
export const LOCALE_VALUES = Object.values(LOCALES) as Locale[];

export const DEFAULT_LOCALE = LOCALES.EN_US;
