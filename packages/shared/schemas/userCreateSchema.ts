import { number, object, string } from "valibot";

export const UserCreateSchema = object({
  roleId: number(),
  firstName: string(),
});
