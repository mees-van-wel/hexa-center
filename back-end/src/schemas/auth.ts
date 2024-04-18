import { email, Input, number, object, optional, string } from "valibot";

export const SendEmailOtpSchema = object({
  email: string([email()]),
});

export const SendPhoneOtpSchema = object({
  // TODO Phone number validation pipe
  phone: string(),
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

export type AccountDetailsUpdateInputSchema = Input<
  typeof AccountDetailsUpdateSchema
>;
