import axios from "axios";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";

import db from "@/db/client";
import { integrationConnections, logs } from "@/db/schema";
import { TRPCError } from "@trpc/server";

type RequestRefreshTokenResponse = {
  refresh_token: string;
  access_token: string;
  expires_in: number;
};

type TwinfieldIntegrationData = {
  refreshToken: string;
  accessToken: string;
  expiresOn: string;
};

export const connectTwinfield = async (code: string, relationId: number) => {
  const clientSecret = process.env.TWINFIELD_CLIENT_SECRET;
  if (!clientSecret)
    throw new Error("Missing TWINFIELD_CLIENT_SECRET in .env.local");

  const params = new URLSearchParams();
  params.append("code", decodeURI(code));
  // TODO dynamic redirect uri
  params.append("redirect_uri", "http://localhost:3000/integrations/twinfield");
  params.append("grant_type", "authorization_code");

  try {
    const {
      data: {
        refresh_token: refreshToken,
        access_token: accessToken,
        expires_in,
      },
    } = await axios.post<RequestRefreshTokenResponse>(
      "https://login.twinfield.com/auth/authentication/connect/token",
      params,
      { headers: { Authorization: `Basic ${clientSecret}` } },
    );

    const expiresOn = dayjs().add(expires_in, "second").toISOString();

    const result = await db
      .select({ id: integrationConnections.id })
      .from(integrationConnections)
      .where(eq(integrationConnections.type, "twinfield"));

    let id = result[0]?.id;

    if (id) {
      await db
        .update(integrationConnections)
        .set({ data: { refreshToken, accessToken, expiresOn } })
        .where(eq(integrationConnections.id, id));
    } else {
      const result = await db
        .insert(integrationConnections)
        .values({
          type: "twinfield",
          data: { refreshToken, accessToken, expiresOn },
        })
        .returning({ id: integrationConnections.id });
      id = result[0].id;
    }

    await db.insert(logs).values({
      type: "info",
      event: "integrationConnect",
      relationId,
      refType: "integration",
      refId: id,
    });

    return { refreshToken, accessToken, expiresOn };
  } catch (error) {
    console.log(error);

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Something went wrong during the connection with Twinfield",
    });
  }
};

export const refreshTwinfield = async () => {
  const clientSecret = process.env.TWINFIELD_CLIENT_SECRET;
  if (!clientSecret)
    throw new Error("Missing TWINFIELD_CLIENT_SECRET in .env.local");

  const result = await db
    .select({
      id: integrationConnections.id,
      data: integrationConnections.data,
    })
    .from(integrationConnections)
    .where(eq(integrationConnections.type, "twinfield"));

  const integration = result[0] as
    | undefined
    | {
        id: number;
        data: TwinfieldIntegrationData;
      };
  if (!integration)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing Twinfield connection",
    });

  const params = new URLSearchParams();

  params.append("grant_type", "refresh_token");
  params.append("refresh_token", decodeURI(integration.data.refreshToken));

  const {
    data: {
      refresh_token: refreshToken,
      access_token: accessToken,
      expires_in,
    },
  } = await axios.post<RequestRefreshTokenResponse>(
    "https://login.twinfield.com/auth/authentication/connect/token",
    params,
    { headers: { Authorization: `Basic ${clientSecret}` } },
  );

  const expiresOn = dayjs().add(expires_in, "second").toISOString();

  await db
    .update(integrationConnections)
    .set({ data: { refreshToken, accessToken, expiresOn } })
    .where(eq(integrationConnections.id, integration.id));

  await db.insert(logs).values({
    type: "info",
    event: "integrationRefreshAuth",
    refType: "integration",
    refId: integration.id,
  });

  return { refreshToken, accessToken, expiresOn };
};

export const getTwinfieldAccessToken = async () => {
  const result = await db
    .select({
      id: integrationConnections.id,
      data: integrationConnections.data,
    })
    .from(integrationConnections)
    .where(eq(integrationConnections.type, "twinfield"));

  const integration = result[0] as
    | undefined
    | {
        id: number;
        data: TwinfieldIntegrationData;
      };
  if (!integration)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing Twinfield connection",
    });

  let accessToken = integration.data.accessToken;
  const staleDate = dayjs(integration.data.expiresOn).subtract(30, "second");

  if (dayjs().isAfter(staleDate)) {
    const data = await refreshTwinfield();
    accessToken = data.accessToken;
  }

  return accessToken;
};
