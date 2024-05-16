import {
  date,
  Input,
  merge,
  nullable,
  nullish,
  number,
  object,
  optional,
  partial,
  string,
} from "valibot";

import { toNull } from "@/valibotPipes/toNull";

export const ReservationCreateSchema = object({
  customerId: number(),
  roomId: number(),
  startDate: date(),
  endDate: date(),
  priceOverride: nullable(string()),
  guestName: nullable(string([toNull()])),
  reservationNotes: nullable(string([toNull()])),
  invoiceNotes: nullable(string([toNull()])),
});

export const ReservationUpdateSchema = merge([
  object({ id: number() }),
  partial(
    object({
      customerId: optional(number()),
      roomId: optional(number()),
      startDate: optional(date()),
      endDate: optional(date()),
      priceOverride: optional(nullish(string())),
      guestName: optional(nullish(string([toNull()]))),
      reservationNotes: optional(nullish(string([toNull()]))),
      invoiceNotes: optional(nullish(string([toNull()]))),
    }),
  ),
]);

export type ReservationCreateInputSchema = Input<
  typeof ReservationCreateSchema
>;
export type ReservationUpdateInputSchema = Input<
  typeof ReservationUpdateSchema
>;

export type ReservationDefaultsSchema = {
  customerId: undefined;
  roomId: undefined;
  startDate: undefined;
  endDate: undefined;
  priceOverride: null;
  guestName: "";
  reservationNotes: "";
  invoiceNotes: "";
};

export type ReservationFormSchema =
  | ReservationDefaultsSchema
  | ReservationCreateInputSchema
  | ReservationUpdateInputSchema;
