import {
  date,
  email,
  Input,
  minLength,
  nullish,
  number,
  object,
  optional,
  string,
} from "valibot";

import { toNull } from "@/valibotPipes/toNull";

export const SendEmailOtpSchema = object({
  email: string([email()]),
});

export const SendPhoneOtpSchema = object({
  // TODO Phone number validation pipe
  phone: string(),
});

export const UserUpdateSchema = object({
  id: number(),
  firstName: optional(string([minLength(2)])),
  lastName: optional(string([minLength(2)])),
  addressLineOne: nullish(string([toNull()])),
  addressLineTwo: nullish(string([toNull()])),
  city: nullish(string([toNull()])),
  region: nullish(string([toNull()])),
  postalCode: nullish(string([toNull()])),
  country: nullish(string()),
  sex: nullish(string()),
  birthDate: nullish(date()),
});

export const AccountDetailsUpdateSchema = object({
  id: number(),
  locale: optional(string()),
  theme: optional(string()),
  timezone: optional(string()),
  dateFormat: optional(string()),
  decimalSeparator: optional(string()),
  timeFormat: optional(string()),
  firstDayOfWeek: optional(string()),
});

export type UserUpdateInputSchema = Input<typeof UserUpdateSchema>;

export type AccountDetailsUpdateInputSchema = Input<
  typeof AccountDetailsUpdateSchema
>;
