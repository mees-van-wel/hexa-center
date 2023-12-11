import type { Endpoint } from "../types.js";
import { object, string } from "valibot";
import { decrypt } from "../utils/encryption.js";
import { verify } from "../utils/jwt.js";

const ValidateOtpSchema = object({
  token: string(),
  otp: string(),
});

export const POST: Endpoint = async ({ res, validate }) => {
  const { token, otp } = validate(ValidateOtpSchema);

  const originalOtp = decrypt(await verify(token));

  return res.json({
    success: true,
    valid: originalOtp === otp,
  });
};
