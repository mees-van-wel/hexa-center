export const DECIMAL_SEPARATORS = {
  AUTO: "AUTO",
  DOT: "DOT",
  COMMA: "COMMA",
} as const;

export type DecimalSeparators = typeof DECIMAL_SEPARATORS;
export type DecimalSeparatorKey = keyof DecimalSeparators;
export type DecimalSeparator = DecimalSeparators[DecimalSeparatorKey];

export const DECIMAL_SEPARATOR_KEYS = Object.keys(
  DECIMAL_SEPARATORS,
) as DecimalSeparatorKey[];
export const DECIMAL_SEPARATOR_VALUES = Object.values(
  DECIMAL_SEPARATORS,
) as DecimalSeparator[];
export const DEFAULT_SEPARATOR = DECIMAL_SEPARATORS.AUTO;
