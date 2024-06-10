import { Input, object, partial, string } from "valibot";

export const PreferencesUpdateSchema = partial(
  object({
    locale: string(),
    theme: string(),
    color: string(),
    timezone: string(),
    dateFormat: string(),
    decimalSeparator: string(),
    timeFormat: string(),
    firstDayOfWeek: string(),
  }),
);

export type PreferencesUpdateInputSchema = Input<
  typeof PreferencesUpdateSchema
>;
