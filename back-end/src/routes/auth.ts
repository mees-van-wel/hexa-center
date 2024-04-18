import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { nullable, object, string } from "valibot";

import {
  SESSION_DURATIONS,
  type SessionDuration,
} from "@/constants/sessionDurations";
import { userAccountDetails, users, userSessions } from "@/db/schema";
import { SendEmailOtpSchema, SendPhoneOtpSchema } from "@/schemas/auth";
import { AccountDetailsUpdateSchema } from "@/schemas/auth";
import { procedure, router } from "@/trpc";
import { decrypt, encrypt } from "@/utils/encryption";
import { isProduction } from "@/utils/environment";
import { createPgException } from "@/utils/exception";
import { sign, verify } from "@/utils/jwt";
import { sendMail } from "@/utils/mail";
import { createOtp } from "@/utils/otp";
import { sendSms } from "@/utils/sms";
import { wrap } from "@decs/typeschema";
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
  email: string(),
  emailToken: string(),
  emailOtp: string(),
  phone: string(),
  phoneToken: string(),
  phoneOtp: string(),
  userAgent: nullable(string()),
  duration: string(),
});

export const authRouter = router({
  sendEmailOtp: procedure
    .meta({ public: true })
    .input(wrap(SendEmailOtpSchema))
    .mutation(({ input, ctx }) => {
      const otp = createOtp();

      (async () => {
        const result = await ctx.db
          .select({
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          })
          .from(users)
          .where(eq(users.email, input.email));

        const user = result[0];

        if (!isProduction)
          return console.log(
            user ? otp : `No user found with email address: '${input.email}'`,
          );

        if (!user) return;

        await sendMail({
          title: "Login email code",
          to: {
            name: `${user.firstName} ${user.lastName}`,
            email: input.email,
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
    .mutation(({ input, ctx }) => {
      const otp = createOtp();

      (async () => {
        const result = await ctx.db
          .select({ phone: users.phone })
          .from(users)
          .where(eq(users.phone, input.phone));

        const user = result[0];

        if (!isProduction)
          return console.log(
            user ? otp : `No user found with phone number: '${input.phone}'`,
          );

        if (!user) return;

        await sendSms({
          to: input.phone,
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
      const [encryptedEmailOtp, encryptedPhoneOtp] = await Promise.all([
        verify(input.emailToken),
        verify(input.phoneToken),
      ]);

      const originalEmailOtp = decrypt(encryptedEmailOtp);
      const originalPhoneOtp = decrypt(encryptedPhoneOtp);

      if (
        originalEmailOtp !== input.emailOtp ||
        originalPhoneOtp !== input.phoneOtp
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid tokens or codes",
        });

      const user = await ctx.db.query.users.findFirst({
        where: and(eq(users.email, input.email), eq(users.phone, input.phone)),
        columns: {
          id: true,
          businessId: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          addressLineOne: true,
          addressLineTwo: true,
          city: true,
          region: true,
          postalCode: true,
          country: true,
          sex: true,
          birthDate: true,
        },
        with: {
          accountDetails: {
            columns: {
              locale: true,
              theme: true,
              color: true,
              timezone: true,
              dateFormat: true,
              decimalSeparator: true,
              timeFormat: true,
              firstDayOfWeek: true,
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

      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Missing user",
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
          const selectSessinosResult = await ctx.db
            .select({ id: userSessions.id })
            .from(userSessions)
            .where(
              and(
                eq(userSessions.userId, user.id),
                eq(userSessions.ipAddress, ipAddress),
                eq(userSessions.userAgent, trueUserAgent),
              ),
            );

          sessionId = selectSessinosResult[0]?.id;
        }

        if (sessionId) {
          await ctx.db
            .update(userSessions)
            .set({
              expiresAt,
              refreshToken,
              issuedAt: now,
              lastAccessed: now,
            })
            .where(eq(userSessions.id, sessionId));
        } else
          await ctx.db.insert(userSessions).values({
            expiresAt,
            refreshToken,
            userId: user.id,
            ipAddress,
            userAgent: trueUserAgent,
          });
      })();

      // TODO cookie util
      ctx.res.cookie(`refreshToken_${ctx.req.tenant}`, refreshToken, {
        domain: isProduction ? ".hexa.center" : undefined,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        httpOnly: true,
        path: "/",
        maxAge,
      });

      return user;
    }),
  currentUser: procedure.query(({ ctx }) => ctx.user),
  updateAccountDetails: procedure
    .input(wrap(AccountDetailsUpdateSchema))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .update(userAccountDetails)
          .set({
            ...input,
          })
          .where(eq(userAccountDetails.id, input.id))
          .returning({
            locale: userAccountDetails.locale,
            theme: userAccountDetails.theme,
            color: userAccountDetails.color,
            timezone: userAccountDetails.timezone,
            dateFormat: userAccountDetails.dateFormat,
            decimalSeparator: userAccountDetails.decimalSeparator,
            timeFormat: userAccountDetails.timeFormat,
            firstDayOfWeek: userAccountDetails.firstDayOfWeek,
          });

        const userAccountDetail = result[0];

        return userAccountDetail;
      } catch (error) {
        throw createPgException(error);
      }
    }),
  token: procedure.query(async ({ ctx }) => {
    const now = new Date();
    // TODO pass now to sign to sync time
    const accessToken = await sign(encrypt(ctx.user.id));

    return {
      accessToken,
      expiresAt: new Date(now.setMinutes(now.getMinutes() + 10)),
    };
  }),
  logout: procedure.meta({ public: true }).mutation(async ({ ctx }) => {
    const refreshToken = ctx.req.cookies[`refreshToken_${ctx.req.tenant}`];
    if (!refreshToken) return;

    await ctx.db
      .delete(userSessions)
      .where(eq(userSessions.refreshToken, refreshToken));

    ctx.res.cookie(`refreshToken_${ctx.req.tenant}`, "", {
      domain: isProduction ? ".hexa.center" : undefined,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return;
  }),
  read: procedure.query(({ ctx }) => ctx.db.select().from(userSessions)),
});
