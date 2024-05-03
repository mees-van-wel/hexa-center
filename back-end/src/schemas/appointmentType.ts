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

export const AppointmentTypeCreateSchema = object({
  name: string([minLength(2)]),
  color: string(),
  appointmentDescription: nullable(string()),
  appointmentDuration: nullable(string()),
});

export const AppointmentTypeUpdateSchema = object({
  id: number(),
  name: optional(string([minLength(2)])),
  color: optional(string()),
  appointmentDescription: nullish(string()),
  appointmentDuration: nullish(string()),
});

export type AppointmentTypeCreateInputSchema = Input<
  typeof AppointmentTypeCreateSchema
>;
export type AppointmentTypeUpdateInputSchema = Input<
  typeof AppointmentTypeUpdateSchema
>;
