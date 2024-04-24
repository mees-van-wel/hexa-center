import { Input, number, object, string } from "valibot";

export const WorkingHourCreateSchema = object({
  accountId: number(),
  startDay: number(),
  endDay: number(),
  startTime: string(),
  endTime: string(),
});

export const WorkingHourUpdateSchema = object({
  id: number(),
  accountId: number(),
  startDay: number(),
  endDay: number(),
  startTime: string(),
  endTime: string(),
});

export type WorkingHourCreateInputSchema = Input<
  typeof WorkingHourCreateSchema
>;
export type WorkingHourUpdateInputSchema = Input<
  typeof WorkingHourUpdateSchema
>;
