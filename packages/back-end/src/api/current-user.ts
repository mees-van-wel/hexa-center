import { and, eq, gt, isNull, or } from "drizzle-orm";
import db from "../db/client.js";
import { Endpoint } from "../types.js";
import { sessions, users } from "../db/schema.js";
import { isProduction } from "../utils/environment.js";

export const GET: Endpoint = async ({ req, res }) => {
  // TODO transfer to authentication util
  let refreshToken = req.cookies.refreshToken;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer "))
    refreshToken = authHeader.substring(7, authHeader.length);

  if (!refreshToken) return res.status(401).json("Missing refresh token");

  const now = new Date();

  const sessionsResult = await db
    .select({
      id: sessions.id,
      userId: sessions.userId,
      expiresAt: sessions.expiresAt,
      ipAddress: sessions.ipAddress,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.refreshToken, refreshToken),
        or(gt(sessions.expiresAt, now), isNull(sessions.expiresAt))
      )
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

    return res.status(401).json("Missing session");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
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

  res.json(user);
};
