import { Input, number, object, string } from "valibot";

export const WorkingHourCreateSchema = object({
  account_id: number(),
  start_day: number(),
  end_day: number(),
  start_time: string(),
  end_time: string(),
});

export const WorkingHourUpdateSchema = object({
  id: number(),
  account_id: number(),
  start_day: number(),
  end_day: number(),
  start_time: string(),
  end_time: string(),
});

export type WorkingHourCreateSchema = Input<typeof WorkingHourCreateSchema>;
export type WorkingHourUpdateSchema = Input<typeof WorkingHourUpdateSchema>;
