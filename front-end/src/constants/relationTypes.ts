export const RELATION_TYPES = {
  INDIVIDUAL: "individual",
  CORPORATE: "corporate",
} as const;

export type RelationTypes = typeof RELATION_TYPES;
export type RelationTypeKey = keyof RelationTypes;
export type RelationType = RelationTypes[RelationTypeKey];

export const RELATION_TYPE_KEYS = Object.keys(
  RELATION_TYPES,
) as RelationTypeKey[];
export const RELATION_TYPE_VALUES = Object.values(
  RELATION_TYPES,
) as RelationType[];
