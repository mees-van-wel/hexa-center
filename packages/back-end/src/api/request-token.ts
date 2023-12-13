import { and, eq, gt, isNull, or } from "drizzle-orm";
import db from "../db/client.js";
import { sessions } from "../db/schema.js";
import { Endpoint } from "../types.js";
import { isProduction } from "../utils/environment.js";
import { sign } from "../utils/jwt.js";
import { encrypt } from "../utils/encryption.js";

export const POST: Endpoint = async ({ req, res }) => {
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

    return res.status(401).json("Missing session");
  }

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

  // await db
  //   .update(sessions)
  //   .set({ lastAccessed: now, refreshToken })
  //   .where(eq(sessions.id, session.id));

  await db
    .update(sessions)
    .set({ lastAccessed: now })
    .where(eq(sessions.id, session.id));

  const accessToken = await sign(encrypt(session.userId));

  res.json({
    accessToken,
    expiresAt: new Date(now.setMinutes(now.getMinutes() + 10)),
  });
};
