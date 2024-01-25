import {
  date,
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

export const UserCreateSchema = object({
  // propertyId: number(),
  // roleId: number(),
  firstName: string([minLength(2)]),
  lastName: string([minLength(2)]),
  email: nullable(string([toNull(), nullableEmail()])),
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

export const UserUpdateSchema = object({
  id: number(),
  // propertyId: optional(number()),
  // roleId: optional(number()),
  firstName: optional(string([minLength(2)])),
  lastName: optional(string([minLength(2)])),
  email: nullish(string([toNull(), nullableEmail()])),
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

export type UserCreateInputSchema = Input<typeof UserCreateSchema>;
export type UserUpdateInputSchema = Input<typeof UserUpdateSchema>;
