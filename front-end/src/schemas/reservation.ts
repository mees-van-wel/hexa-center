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

import { toNull } from "@/valibotPipes/toNull";

export const ReservationCreateSchema = object({
  roomId: number(),
  customerId: number(),
  startDate: date(),
  endDate: date(),
  priceOverride: nullable(number()),
  notes: nullable(string([toNull()])),
});

export const ReservationUpdateSchema = object({
  id: number(),
  roomId: optional(number()),
  customerId: optional(number()),
  startDate: optional(date()),
  endDate: optional(date()),
  priceOverride: nullish(number()),
  notes: nullish(string([toNull()])),
});

export type ReservationInputCreateSchema = Input<
  typeof ReservationCreateSchema
>;
export type ReservationInputUpdateSchema = Input<
  typeof ReservationUpdateSchema
>;
