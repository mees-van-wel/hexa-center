import { and, eq, gt, isNull, or } from "drizzle-orm";

import { isProduction } from "@/utils/environment";
import { trpcTransformer } from "@/utils/trpcTransformer";
import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

import db from "./db/client";
import { relations, sessions } from "./db/schema";

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  let refreshToken = req.cookies.refreshToken;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer "))
    refreshToken = authHeader.substring(7, authHeader.length);

  if (!refreshToken) return { req, res, relation: null };

  const now = new Date();

  const sessionsResult = await db
    .select({
      id: sessions.id,
      relationId: sessions.relationId,
      expiresAt: sessions.expiresAt,
      ipAddress: sessions.ipAddress,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.refreshToken, refreshToken),
        or(gt(sessions.expiresAt, now), isNull(sessions.expiresAt)),
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

    return { req, res, relation: null };
  }

  const relation = await db.query.relations.findFirst({
    where: eq(relations.id, session.relationId),
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
      propertyId: true,
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
      .update(sessions)
      .set({
        lastAccessed: now,
        // refreshToken,
      })
      .where(eq(sessions.id, session.id));
  })();

  return { req, res, relation: relation || null };
};

type Context = Awaited<ReturnType<typeof createContext>>;

type Meta = {
  public: boolean;
};

const t = initTRPC.context<Context>().meta<Meta>().create({
  transformer: trpcTransformer,
});

const authMiddleware = t.middleware(({ meta, next, ctx }) => {
  if (!meta?.public && !ctx.relation)
    throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      relation: ctx.relation as NonNullable<typeof ctx.relation>,
    },
  });
});

export const middleware = t.middleware;
export const router = t.router;
export const procedure = t.procedure.use(authMiddleware);
