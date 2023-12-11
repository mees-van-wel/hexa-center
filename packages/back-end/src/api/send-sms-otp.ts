import type { Endpoint } from "../types.js";
import { object, string } from "valibot";
import { createOtp } from "../utils/otp.js";
import client from "../db/client.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { isDev } from "../utils/environment.js";
import { sendSms } from "../utils/sms.js";
import { sign } from "../utils/jwt.js";
import { encrypt } from "../utils/encryption.js";

const ValidateOtpSchema = object({
  phoneNumber: string(),
});

export const POST: Endpoint = async ({ res, validate }) => {
  const { phoneNumber } = validate(ValidateOtpSchema);

  const otp = createOtp();

  (async () => {
    const result = await client
      .select({ phoneNumber: users.phoneNumber })
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    const user = result[0];

    if (isDev)
      return console.log(
        user ? otp : `No user found with phone number: '${phoneNumber}'`,
      );

    if (!user) return;

    await sendSms({
      to: phoneNumber,
      message: otp,
    });
  })();

  const token = await sign(encrypt(otp));

  res.json({
    success: true,
    token,
  });
};
