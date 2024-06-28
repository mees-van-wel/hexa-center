import { Input, minLength, number, object, optional, string } from "valibot";

export const RoomCreateSchema = object({
  name: string([minLength(2)]),
  price: string([minLength(1)]),
});

export const RoomUpdateSchema = object({
  id: number(),
  name: optional(string([minLength(2)])),
  price: optional(string([minLength(1)])),
});

export type RoomInputCreateSchema = Input<typeof RoomCreateSchema>;
export type RoomInputUpdateSchema = Input<typeof RoomUpdateSchema>;
