import { object, string, nullable } from "valibot";
import { Endpoint } from "../types.js";
import db from "../db/client.js";
import { sessions, users } from "../db/schema.js";
import { verify } from "../utils/jwt.js";
import { decrypt } from "../utils/encryption.js";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";
import {
  SESSION_DURATIONS,
  SessionDuration,
} from "@hexa-center/shared/constants/sessionDurations.js";
import { isProduction } from "../utils/environment.js";

const MAX_AGE = {
  [SESSION_DURATIONS.SESSION]: undefined,
  [SESSION_DURATIONS.DAY]: 1 * 24 * 60 * 60 * 1000,
  [SESSION_DURATIONS.WEEK]: 7 * 24 * 60 * 60 * 1000,
  [SESSION_DURATIONS.MONTH]: 30 * 24 * 60 * 60 * 1000,
};

const LoginSchema = object({
  email: string(),
  emailToken: string(),
  emailOtp: string(),
  phoneNumber: string(),
  phoneNumberToken: string(),
  phoneNumberOtp: string(),
  userAgent: nullable(string()),
  duration: string(),
});

export const POST: Endpoint = async ({ req, res, validate }) => {
  const {
    email,
    emailToken,
    emailOtp,
    phoneNumber,
    phoneNumberToken,
    phoneNumberOtp,
    userAgent,
    duration,
  } = validate(LoginSchema);

  const [encryptedEmailOtp, encryptedPhoneNumberOtp] = await Promise.all([
    verify(emailToken),
    verify(phoneNumberToken),
  ]);

  const originalEmailOtp = decrypt(encryptedEmailOtp);
  const originalPhoneNumberOtp = decrypt(encryptedPhoneNumberOtp);

  if (
    originalEmailOtp !== emailOtp ||
    originalPhoneNumberOtp !== phoneNumberOtp
  ) {
    // TODO Error handling
    throw new Error("Invalid tokens or codes");
  }

  const user = await db.query.users.findFirst({
    where: and(eq(users.email, email), eq(users.phoneNumber, phoneNumber)),
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      street: true,
      houseNumber: true,
      postalCode: true,
      city: true,
      region: true,
      country: true,
      sex: true,
      dateOfBirth: true,
    },
    with: {
      account: {
        columns: {
          locale: true,
          theme: true,
          color: true,
          timezone: true,
        },
        with: {
          workingHours: {
            columns: {
              id: true,
              startDay: true,
              endDay: true,
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    // TODO Error handling
    throw new Error("Missing user");
  }

  const maxAge = MAX_AGE[duration as SessionDuration];
  const now = new Date();
  const expiresAt = maxAge ? new Date(now.getTime() + maxAge) : null;
  const refreshToken = crypto.randomBytes(32).toString("base64url");

  (async () => {
    const ipAddress = req.ip;
    const trueUserAgent = userAgent || req.headers["user-agent"];
    let sessionId: number | null = null;

    if (ipAddress && trueUserAgent) {
      const selectSessinosResult = await db
        .select({ id: sessions.id })
        .from(sessions)
        .where(
          and(
            eq(sessions.userId, user.id),
            eq(sessions.ipAddress, ipAddress),
            eq(sessions.userAgent, trueUserAgent),
          ),
        );

      sessionId = selectSessinosResult[0]?.id;
    }

    if (sessionId) {
      await db
        .update(sessions)
        .set({
          expiresAt,
          refreshToken,
          issuedAt: now,
          lastAccessed: now,
        })
        .where(eq(sessions.id, sessionId));
    } else
      await db.insert(sessions).values({
        expiresAt,
        refreshToken,
        userId: user.id,
        ipAddress,
        userAgent: trueUserAgent,
      });
  })();

  res.cookie("refreshToken", refreshToken, {
    domain: isProduction ? ".hexa.center" : undefined,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    httpOnly: true,
    path: "/",
    maxAge,
  });

  res.json(user);
};
