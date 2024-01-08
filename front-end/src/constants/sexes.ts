export const SEXES = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  INTERSEX: "INTERSEX",
  OTHER: "OTHER",
} as const;

export type Sexes = typeof SEXES;
export type SexKey = keyof Sexes;
export type Sex = Sexes[SexKey];

export const SEX_KEYS = Object.keys(SEXES) as SexKey[];
export const SEX_VALUES = Object.values(SEXES) as Sex[];
