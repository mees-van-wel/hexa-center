import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { nullable, object, string } from "valibot";

import db from "@/db/client";
import { relations, sessions } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { decrypt, encrypt } from "@/utils/encryption";
import { isProduction } from "@/utils/environment";
import { sign, verify } from "@/utils/jwt";
import { sendMail } from "@/utils/mail";
import { createOtp } from "@/utils/otp";
import { sendSms } from "@/utils/sms";
import { wrap } from "@decs/typeschema";
import {
  SESSION_DURATIONS,
  type SessionDuration,
} from "@front-end/constants/sessionDurations";
import {
  SendEmailOtpSchema,
  SendPhoneOtpSchema,
} from "@front-end/schemas/auth";
import { TRPCError } from "@trpc/server";

const MAX_AGE = {
  [SESSION_DURATIONS.SESSION]: undefined,
  [SESSION_DURATIONS.DAY]: 1 * 24 * 60 * 60 * 1000,
  [SESSION_DURATIONS.WEEK]: 7 * 24 * 60 * 60 * 1000,
  [SESSION_DURATIONS.MONTH]: 30 * 24 * 60 * 60 * 1000,
};

const ValidateOtpSchema = object({
  token: string(),
  otp: string(),
});

const LoginSchema = object({
  emailAddress: string(),
  emailAddressToken: string(),
  emailAddressOtp: string(),
  phoneNumber: string(),
  phoneNumberToken: string(),
  phoneNumberOtp: string(),
  userAgent: nullable(string()),
  duration: string(),
});

export const authRouter = router({
  sendEmailOtp: procedure
    .meta({ public: true })
    .input(wrap(SendEmailOtpSchema))
    .mutation(({ input }) => {
      const otp = createOtp();

      (async () => {
        const result = await db
          .select({
            name: relations.name,
            emailAddress: relations.emailAddress,
          })
          .from(relations)
          .where(eq(relations.emailAddress, input.emailAddress));

        const relation = result[0];

        if (!isProduction)
          return console.log(
            relation
              ? otp
              : `No relation found with email address: '${input.emailAddress}'`,
          );

        if (!relation) return;

        await sendMail({
          title: "Login email code",
          to: {
            name: relation.name,
            emailAddress: input.emailAddress,
          },
          template: "otp",
          variables: {
            message: `Here is your code to login.`,
            otp,
            validity:
              "This code is valid for 10 minutes. Do not share this code with anyone.",
          },
          footer:
            "If you did not request this, please ignore this email or contact our support department.",
        });
      })();

      return sign(encrypt(otp));
    }),
  sendPhoneOtp: procedure
    .meta({ public: true })
    .input(wrap(SendPhoneOtpSchema))
    .mutation(({ input }) => {
      const otp = createOtp();

      (async () => {
        const result = await db
          .select({ phoneNumber: relations.phoneNumber })
          .from(relations)
          .where(eq(relations.phoneNumber, input.phoneNumber));

        const relation = result[0];

        if (!isProduction)
          return console.log(
            relation
              ? otp
              : `No relation found with phone number: '${input.phoneNumber}'`,
          );

        if (!relation) return;

        await sendSms({
          to: input.phoneNumber,
          message: otp,
        });
      })();

      return sign(encrypt(otp));
    }),
  validateOtp: procedure
    .meta({ public: true })
    .input(wrap(ValidateOtpSchema))
    .mutation(async ({ input }) => {
      const originalOtp = decrypt(await verify(input.token));
      return originalOtp === input.otp;
    }),
  login: procedure
    .meta({ public: true })
    .input(wrap(LoginSchema))
    .mutation(async ({ input, ctx }) => {
      const [encryptedEmailOtp, encryptedPhoneNumberOtp] = await Promise.all([
        verify(input.emailAddressToken),
        verify(input.phoneNumberToken),
      ]);

      const originalEmailOtp = decrypt(encryptedEmailOtp);
      const originalPhoneNumberOtp = decrypt(encryptedPhoneNumberOtp);

      if (
        originalEmailOtp !== input.emailAddressOtp ||
        originalPhoneNumberOtp !== input.phoneNumberOtp
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid tokens or codes",
        });

      const relation = await db.query.relations.findFirst({
        where: and(
          eq(relations.emailAddress, input.emailAddress),
          eq(relations.phoneNumber, input.phoneNumber),
        ),
        columns: {
          id: true,
          name: true,
          emailAddress: true,
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

      if (!relation)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Missing relation",
        });

      const maxAge = MAX_AGE[input.duration as SessionDuration];
      const now = new Date();
      const expiresAt = maxAge ? new Date(now.getTime() + maxAge) : null;
      // TODO token util
      const refreshToken = crypto.randomBytes(32).toString("base64url");

      (async () => {
        const ipAddress = ctx.req.ip;
        const trueUserAgent = input.userAgent || ctx.req.headers["user-agent"];
        let sessionId: number | null = null;

        if (ipAddress && trueUserAgent) {
          const selectSessinosResult = await db
            .select({ id: sessions.id })
            .from(sessions)
            .where(
              and(
                eq(sessions.relationId, relation.id),
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
            relationId: relation.id,
            ipAddress,
            userAgent: trueUserAgent,
          });
      })();

      // TODO cookie util
      ctx.res.cookie("refreshToken", refreshToken, {
        domain: isProduction ? ".hexa.center" : undefined,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        httpOnly: true,
        path: "/",
        maxAge,
      });

      return relation;
    }),
  currentRelation: procedure.query(({ ctx }) => ctx.relation),
  token: procedure.query(async ({ ctx }) => {
    const now = new Date();
    // TODO pass now to sign to sync time
    const accessToken = await sign(encrypt(ctx.relation.id));

    return {
      accessToken,
      expiresAt: new Date(now.setMinutes(now.getMinutes() + 10)),
    };
  }),
  logout: procedure.meta({ public: true }).mutation(async ({ ctx }) => {
    const refreshToken = ctx.req.cookies.refreshToken;
    if (!refreshToken) return;

    await db.delete(sessions).where(eq(sessions.refreshToken, refreshToken));

    ctx.res.cookie("refreshToken", "", {
      domain: isProduction ? ".hexa.center" : undefined,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return;
  }),
  read: procedure.query(() => db.select().from(sessions)),
});
