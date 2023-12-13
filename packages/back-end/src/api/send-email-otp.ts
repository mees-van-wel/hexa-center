import type { Endpoint } from "../types.js";
import { createOtp } from "../utils/otp.js";
import db from "../db/client.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { isProduction } from "../utils/environment.js";
import { sendMail } from "../utils/mail.js";
import { encrypt } from "../utils/encryption.js";
import { sign } from "../utils/jwt.js";
import { object, string, email } from "valibot";

const SendEmailOtpSchema = object({
  email: string([email()]),
});

export const POST: Endpoint = async ({ res, validate }) => {
  const { email } = validate(SendEmailOtpSchema);

  const otp = createOtp();

  (async () => {
    const result = await db
      .select({
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email));

    const user = result[0];

    if (!isProduction)
      return console.log(user ? otp : `No user found with email: '${email}'`);

    if (!user) return;

    await sendMail({
      title: "Login email code",
      to: {
        name: `${user.firstName} ${user.lastName}`,
        email,
      },
      template: "otp",
      variables: {
        message: `Hello ${user.firstName}, here is your code to login.`,
        otp,
        validity:
          "This code is valid for 10 minutes. Do not share this code with anyone.",
      },
      footer:
        "If you did not request this, please ignore this email or contact our support department.",
    });
  })();

  const token = await sign(encrypt(otp));

  res.json({
    success: true,
    token,
  });
};
