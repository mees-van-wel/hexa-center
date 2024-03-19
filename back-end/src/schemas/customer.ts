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

// TODO picklist options from constant
// TODO Phone number validation pipe
// TODO country picklist
// TODO sex picklist
export const CustomerCreateSchema = object({
  // businessId: number(),
  name: string([minLength(2)]),
  email: nullable(string([toNull(), nullableEmail()])),
  phone: nullable(string([toNull()])),
  billingAddressLineOne: string([minLength(2)]),
  billingAddressLineTwo: nullable(string([toNull()])),
  billingCity: string([minLength(2)]),
  billingRegion: nullable(string([toNull()])),
  billingPostalCode: nullable(string([toNull()])),
  billingCountry: string([minLength(2)]),
  cocNumber: nullable(string([toNull()])),
  vatId: nullable(string([toNull()])),
  contactPersonName: nullable(string([toNull()])),
  contactPersonEmail: nullable(string([toNull()])),
  contactPersonPhone: nullable(string([toNull()])),
});

export const CustomerUpdateSchema = object({
  id: number(),
  // businessId: optional(number()),
  name: optional(string([minLength(2)])),
  email: nullish(string([toNull(), nullableEmail()])),
  phone: nullish(string([toNull()])),
  billingAddressLineOne: optional(string([minLength(2)])),
  billingAddressLineTwo: nullish(string([toNull()])),
  billingCity: optional(string([minLength(2)])),
  billingRegion: nullish(string([toNull()])),
  billingPostalCode: nullish(string([toNull()])),
  billingCountry: optional(string([minLength(2)])),
  cocNumber: nullish(string([toNull()])),
  vatId: nullish(string([toNull()])),
  contactPersonName: nullish(string([toNull()])),
  contactPersonEmail: nullish(string([toNull()])),
  contactPersonPhone: nullish(string([toNull()])),
});

export type CustomerCreateInputSchema = Input<typeof CustomerCreateSchema>;
export type CustomerUpdateInputSchema = Input<typeof CustomerUpdateSchema>;
