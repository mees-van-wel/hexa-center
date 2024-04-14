import { Input, number, object, optional, string } from "valibot";

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

// TODO remove to excisting auth
