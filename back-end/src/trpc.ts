import { and, eq, gt, isNull, or } from "drizzle-orm";

import { isProduction } from "@/utils/environment";
import { trpcTransformer } from "@/utils/trpcTransformer";
import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

import { users, userSessions } from "./db/schema";

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  let refreshToken = req.cookies.refreshToken;
  const authHeader = req.headers.authorization;
  const db = req.db;

  if (authHeader && authHeader.startsWith("Bearer "))
    refreshToken = authHeader.substring(7, authHeader.length);

  if (!refreshToken) return { req, res, db, user: null };

  const now = new Date();

  const sessionsResult = await db
    .select({
      id: userSessions.id,
      userId: userSessions.userId,
      expiresAt: userSessions.expiresAt,
      ipAddress: userSessions.ipAddress,
    })
    .from(userSessions)
    .where(
      and(
        eq(userSessions.refreshToken, refreshToken),
        or(gt(userSessions.expiresAt, now), isNull(userSessions.expiresAt)),
      ),
    );

  const session = sessionsResult[0];
  if (!session) {
    res.cookie("refreshToken", "", {
      domain: isProduction ? ".hexa.center" : undefined,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return { req, res, db, user: null };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: {
      id: true,
      propertyId: true,
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

  // TODO Token rotation (Causes infinte loop on front-end for some reason)
  // refreshToken = crypto.randomBytes(32).toString("base64url");

  // res.cookie("refreshToken", refreshToken, {
  //   domain: isProduction ? ".hexa.center" : undefined,
  //   sameSite: isProduction ? "none" : "lax",
  //   secure: isProduction,
  //   httpOnly: true,
  //   path: "/",
  //   maxAge: session.expiresAt
  //     ? session.expiresAt.getTime() - now.getTime()
  //     : undefined,
  // });

  (async () => {
    await db
      .update(userSessions)
      .set({
        lastAccessed: now,
        // refreshToken,
      })
      .where(eq(userSessions.id, session.id));
  })();

  return { req, res, db, user: user || null };
};

type Context = Awaited<ReturnType<typeof createContext>>;

type Meta = {
  public: boolean;
};

const t = initTRPC.context<Context>().meta<Meta>().create({
  transformer: trpcTransformer,
});

const authMiddleware = t.middleware(({ meta, next, ctx }) => {
  if (!meta?.public && !ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      user: ctx.user as NonNullable<typeof ctx.user>,
    },
  });
});

export const middleware = t.middleware;
export const router = t.router;
export const procedure = t.procedure.use(authMiddleware);
