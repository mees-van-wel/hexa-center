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

// TODO picklist options from constant
// TODO Phone number validation pipe
// TODO country picklist
// TODO sex picklist
export const RelationCreateSchema = object({
  // propertyId: number(),
  // roleId: number(),
  type: picklist(["individual", "business"]),
  name: string([minLength(2)]),
  emailAddress: nullable(string([toNull(), nullableEmail()])),
  phoneNumber: nullable(string([toNull()])),
  street: nullable(string([toNull()])),
  houseNumber: nullable(string([toNull()])),
  postalCode: nullable(string([toNull()])),
  city: nullable(string([toNull()])),
  region: nullable(string([toNull()])),
  country: nullable(string()),
  dateOfBirth: nullable(date()),
  sex: nullable(string()),
  vatNumber: nullable(string([toNull()])),
  cocNumber: nullable(string([toNull()])),
  businessContactName: nullable(string([toNull()])),
  businessContactEmailAddress: nullable(string([toNull()])),
  businessContactPhoneNumber: nullable(string([toNull()])),
});

export const RelationUpdateSchema = object({
  id: number(),
  // propertyId: optional(number()),
  // roleId: optional(number()),
  type: optional(picklist(["individual", "business"])),
  name: optional(string([minLength(2)])),
  emailAddress: nullish(string([toNull(), nullableEmail()])),
  phoneNumber: nullish(string([toNull()])),
  street: nullish(string([toNull()])),
  houseNumber: nullish(string([toNull()])),
  postalCode: nullish(string([toNull()])),
  city: nullish(string([toNull()])),
  region: nullish(string([toNull()])),
  country: nullish(string()),
  dateOfBirth: nullish(date()),
  sex: nullish(string()),
  vatNumber: nullish(string([toNull()])),
  cocNumber: nullish(string([toNull()])),
  businessContactName: nullish(string([toNull()])),
  businessContactEmailAddress: nullish(string([toNull()])),
  businessContactPhoneNumber: nullish(string([toNull()])),
});

export type RelationCreateInputSchema = Input<typeof RelationCreateSchema>;
export type RelationUpdateInputSchema = Input<typeof RelationUpdateSchema>;
