import {
  date,
  Input,
  nullable,
  nullish,
  number,
  object,
  optional,
  string,
} from "valibot";

export const ReservationCreateSchema = object({
  roomId: number(),
  customerId: number(),
  startDate: date(),
  endDate: date(),
  notes: nullable(string()),
  guestName: nullable(string()),
});

export const ReservationUpdateSchema = object({
  id: number(),
  roomId: optional(number()),
  customerId: optional(number()),
  startDate: optional(date()),
  endDate: optional(date()),
  notes: nullish(string()),
  guestName: nullish(string()),
});

export type ReservationInputCreateSchema = Input<
  typeof ReservationCreateSchema
>;
export type ReservationInputUpdateSchema = Input<
  typeof ReservationUpdateSchema
>;
