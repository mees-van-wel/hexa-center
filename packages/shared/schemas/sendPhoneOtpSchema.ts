import { object, string } from "valibot";

// TODO phone number validation
export const SendPhoneOtpSchema = object({
  phoneNumber: string(),
});
