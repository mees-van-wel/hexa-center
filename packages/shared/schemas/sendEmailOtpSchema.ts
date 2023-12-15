import { email, object, string } from "valibot";

export const SendEmailOtpSchema = object({
  email: string([email()]),
});
