import {
  email,
  Input,
  minLength,
  nullable,
  nullish,
  number,
  object,
  optional,
  string,
} from "valibot";

import { toNull } from "@/valibotPipes/toNull";

export const BusinessCreateSchema = object({
  name: string([minLength(2)]),
  email: string([email()]),
  phone: string([minLength(2)]),
  addressLineOne: string([minLength(2)]),
  addressLineTwo: nullable(string([toNull()])),
  city: string([minLength(2)]),
  region: nullable(string([toNull()])),
  postalCode: nullable(string([toNull()])),
  country: string([minLength(2)]),
  cocNumber: string([minLength(2)]),
  vatId: string([minLength(2)]),
  iban: string([minLength(2)]),
  swiftBic: string([minLength(2)]),
});

export const BusinessUpdateSchema = object({
  id: number(),
  name: optional(string([minLength(2)])),
  email: optional(string([email()])),
  phone: optional(string([minLength(2)])),
  addressLineOne: optional(string([minLength(2)])),
  addressLineTwo: nullish(string([toNull()])),
  city: optional(string([minLength(2)])),
  region: nullish(string([toNull()])),
  postalCode: nullish(string([toNull()])),
  country: optional(string([minLength(2)])),
  cocNumber: optional(string([minLength(2)])),
  vatId: optional(string([minLength(2)])),
  iban: optional(string([minLength(2)])),
  swiftBic: optional(string([minLength(2)])),
});

export type BusinessCreateInputSchema = Input<typeof BusinessCreateSchema>;
export type BusinessUpdateInputSchema = Input<typeof BusinessUpdateSchema>;
