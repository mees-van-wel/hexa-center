import {
  Input,
  minLength,
  nullable,
  nullish,
  number,
  object,
  optional,
  string,
} from "valibot";

import { nullableEmail } from "@/valibotPipes/nullableEmail";
import { toNull } from "@/valibotPipes/toNull";

export const PropertyCreateSchema = object({
  name: string([minLength(2)]),
  emailAddress: nullable(string([toNull(), nullableEmail()])),
  phoneNumber: nullable(string()),
  street: nullable(string()),
  houseNumber: nullable(string()),
  postalCode: nullable(string()),
  city: nullable(string()),
  region: nullable(string()),
  country: nullable(string()),
});

export const PropertyUpdateSchema = object({
  id: number(),
  name: optional(string([minLength(2)])),
  emailAddress: nullish(string([toNull(), nullableEmail()])),
  phoneNumber: nullish(string()),
  street: nullish(string()),
  houseNumber: nullish(string()),
  postalCode: nullish(string()),
  city: nullish(string()),
  region: nullish(string()),
  country: nullish(string()),
});

export type PropertyCreateInputSchema = Input<typeof PropertyCreateSchema>;
export type PropertyUpdateInputSchema = Input<typeof PropertyUpdateSchema>;