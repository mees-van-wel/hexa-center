import {
  date,
  Input,
  minLength,
  nullable,
  nullish,
  number,
  object,
  optional,
  picklist,
  string,
} from "valibot";

import { nullableEmail } from "@/valibotPipes/nullableEmail";
import { toNull } from "@/valibotPipes/toNull";

export const RelationCreateSchema = object({
  // propertyId: number(),
  // roleId: number(),
  // TODO picklist options from constant
  type: picklist(["individual", "corporate"]),
  name: string([minLength(2)]),
  emailAddress: nullable(string([toNull(), nullableEmail()])),
  // TODO Phone number validation pipe
  phoneNumber: nullable(string([toNull()])),
  dateOfBirth: nullable(date()),
  // TODO sex picklist
  sex: nullable(string()),
  street: nullable(string([toNull()])),
  houseNumber: nullable(string([toNull()])),
  postalCode: nullable(string([toNull()])),
  city: nullable(string([toNull()])),
  region: nullable(string([toNull()])),
  // TODO country picklist
  country: nullable(string()),
});

export const RelationUpdateSchema = object({
  id: number(),
  // propertyId: optional(number()),
  // roleId: optional(number()),
  // TODO type picklist
  type: optional(picklist(["individual", "corporate"])),
  name: optional(string([minLength(2)])),
  emailAddress: nullish(string([toNull(), nullableEmail()])),
  // TODO Phone number validation pipe
  phoneNumber: nullish(string([toNull()])),
  dateOfBirth: nullish(date()),
  // TODO sex picklist
  sex: nullish(string()),
  street: nullish(string([toNull()])),
  houseNumber: nullish(string([toNull()])),
  postalCode: nullish(string([toNull()])),
  city: nullish(string([toNull()])),
  region: nullish(string([toNull()])),
  // TODO country picklist
  country: nullish(string()),
});

export type RelationCreateInputSchema = Input<typeof RelationCreateSchema>;
export type RelationUpdateInputSchema = Input<typeof RelationUpdateSchema>;
