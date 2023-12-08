import { object, string } from "valibot";

export const AuthLoginEmailSchema = object({
  email: string(),
});
