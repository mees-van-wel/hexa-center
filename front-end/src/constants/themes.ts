export const THEMES = {
  LIGHT: "LIGHT",
  DARK: "DARK",
  AUTO: "AUTO",
} as const;

export type Themes = typeof THEMES;
export type ThemeKey = keyof Themes;
export type Theme = Themes[ThemeKey];

export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];
export const THEME_VALUES = Object.values(THEMES) as Theme[];
export const DEFAULT_THEME = THEMES.LIGHT;
