import { email, object, string } from "valibot";

export const SendEmailOtpSchema = object({
  email: string([email()]),
});

export const SendPhoneOtpSchema = object({
  // TODO Phone number validation pipe
  phoneNumber: string(),
});
