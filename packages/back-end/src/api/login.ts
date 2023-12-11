import { object, string } from "valibot";
import { Endpoint } from "../types.js";
import client from "../db/client.js";
import { users } from "../db/schema.js";
import { verify } from "../utils/jwt.js";
import { decrypt } from "../utils/encryption.js";
import { and, eq } from "drizzle-orm";

const LoginSchema = object({
  email: string(),
  emailToken: string(),
  emailOtp: string(),
  phoneNumber: string(),
  phoneNumberToken: string(),
  phoneNumberOtp: string(),
  duration: string(),
  fingerprint: string(),
});

export const POST: Endpoint = async ({ res, validate }) => {
  const {
    email,
    emailToken,
    emailOtp,
    phoneNumber,
    phoneNumberToken,
    phoneNumberOtp,
    duration,
    fingerprint,
  } = validate(LoginSchema);

  const [encryptedEmailOtp, encryptedPhoneNumberOtp] = await Promise.all([
    verify(emailToken),
    verify(phoneNumberToken),
  ]);

  const originalEmailOtp = decrypt(encryptedEmailOtp);
  const originalPhoneNumberOtp = decrypt(encryptedPhoneNumberOtp);

  if (originalEmailOtp !== emailOtp) {
    // TODO Error handling
  }

  if (originalPhoneNumberOtp !== phoneNumberOtp) {
    // TODO Error handling
  }

  const result = await client
    .select({ phoneNumber: users.phoneNumber })
    .from(users)
    .where(and(eq(users.email, email), eq(users.phoneNumber, phoneNumber)));

  const user = result[0];

  if (!user) {
    // TODO Error handling
  }

  res.json();
};
