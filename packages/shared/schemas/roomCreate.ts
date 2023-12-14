import { number, object, string } from "valibot";

export const RoomCreateSchema = object({
  name: string("form.required"),
  price: string("form.required"),
});
