import {
  date,
  Input,
  merge,
  minLength,
  nullable,
  nullish,
  number,
  object,
  optional,
  partial,
  string,
} from "valibot";

import { nullableEmail } from "@/valibotPipes/nullableEmail";
import { toNull } from "@/valibotPipes/toNull";

// TODO picklist options from constant
// TODO Phone number validation pipe
// TODO country picklist
// TODO sex picklist
export const UserCreateSchema = object({
  // businessId: number(),
  // roleId: number(),
  firstName: string([minLength(2)]),
  lastName: string([minLength(2)]),
  email: nullable(string([toNull(), nullableEmail()])),
  phone: nullable(string([toNull()])),
  addressLineOne: nullable(string([toNull()])),
  addressLineTwo: nullable(string([toNull()])),
  city: nullable(string([toNull()])),
  region: nullable(string([toNull()])),
  postalCode: nullable(string([toNull()])),
  country: nullable(string()),
  sex: nullable(string()),
  birthDate: nullable(date()),
});

export const UserUpdateSchema = merge([
  object({ id: number() }),
  partial(
    object({
      // businessId: optional(number()),
      // roleId: optional(number()),
      firstName: optional(string([minLength(2)])),
      lastName: optional(string([minLength(2)])),
      email: nullish(string([toNull(), nullableEmail()])),
      phone: nullish(string([toNull()])),
      addressLineOne: nullish(string([toNull()])),
      addressLineTwo: nullish(string([toNull()])),
      city: nullish(string([toNull()])),
      region: nullish(string([toNull()])),
      postalCode: nullish(string([toNull()])),
      country: nullish(string()),
      sex: nullish(string()),
      birthDate: nullish(date()),
    }),
  ),
]);

export type UserCreateInputSchema = Input<typeof UserCreateSchema>;
export type UserUpdateInputSchema = Input<typeof UserUpdateSchema>;
