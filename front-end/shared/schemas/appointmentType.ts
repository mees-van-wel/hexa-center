import { toNull } from "@shared/valibotPipes/toNull";
import {
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

export const AppointmentTypeCreateSchema = object({
  name: string([minLength(2)]),
  // TODO Hex color validation
  color: string([minLength(7)]),
  appointmentDescription: nullable(string([toNull()])),
  appointmentDuration: nullable(string([toNull()])),
});

export const AppointmentTypeUpdateSchema = merge([
  object({ id: number() }),
  partial(
    object({
      name: optional(string([minLength(2)])),
      color: optional(string([minLength(7)])),
      appointmentDescription: nullish(string([toNull()])),
      appointmentDuration: nullish(string([toNull()])),
    }),
  ),
]);

export type AppointmentTypeDefaultsSchema = {
  name: "";
  color: "";
  appointmentDescription: "";
  appointmentDuration: "";
};

export type AppointmentTypeCreateInputSchema = Input<
  typeof AppointmentTypeCreateSchema
>;
export type AppointmentTypeUpdateInputSchema = Input<
  typeof AppointmentTypeUpdateSchema
>;
export type AppointmentTypeFormSchema =
  | AppointmentTypeDefaultsSchema
  | AppointmentTypeCreateInputSchema
  | AppointmentTypeUpdateInputSchema;
