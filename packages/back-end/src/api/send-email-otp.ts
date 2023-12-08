import type { Endpoint } from "../types.js";
import { createOtp } from "../utils/otp.js";
import client from "../db/client.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { isDev } from "../utils/environment.js";
import { sendMail } from "../utils/mail.js";
import { encrypt } from "../utils/encryption.js";
import { sign } from "../utils/jwt.js";
import { object, string } from "valibot";

const SendEmailOtpSchema = object({
  email: string(),
});

export const POST: Endpoint = async ({ res, validate }) => {
  const { email } = validate(SendEmailOtpSchema);

  const otp = createOtp();

  (async () => {
    const result = await client
      .select({
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email));

    const user = result[0];

    if (isDev)
      return console.log(user ? otp : `No user found with email: '${email}'`);

    if (!user) return;

    await sendMail({
      title: "OTP",
      to: {
        name: `${user.firstName} ${user.lastName}`,
        email,
      },
      template: "otp",
      variables: {
        message: "lol",
        otp,
        validity: "10 minutes",
      },
    });
  })();

  const token = await sign(encrypt(otp));

  res.json({
    success: true,
    token,
  });
};
