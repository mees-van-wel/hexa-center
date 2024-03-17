import axios from "axios";
import dayjs from "dayjs";
import { eq, sql } from "drizzle-orm";

import db from "@/db/client";
import { integrationConnections, logs } from "@/db/schema";
import { TRPCError } from "@trpc/server";

type RequestRefreshTokenResponse = {
  refresh_token: string;
  access_token: string;
  expires_in: number;
};

export type TwinfieldIntegrationData = {
  refreshToken: string;
  accessToken: string;
  expiresOn: string;
  companyCode: string;
  reservationRevenueAccountId: number;
  transactionBalanceAccountId: number;
  transactionAccountTypeId: number;
  spreadBalanceAccountId: number;
  spreadAccountTypeId: number;
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
      .select({
        id: integrationConnections.id,
        data: integrationConnections.data,
      })
      .from(integrationConnections)
      .where(eq(integrationConnections.type, "twinfield"));

    let integration = result[0];

    if (integration) {
      await db
        .update(integrationConnections)
        .set({
          data: sql`${{
            ...(integration.data as TwinfieldIntegrationData),
            refreshToken,
            accessToken,
            expiresOn,
          }}::jsonb`,
        })
        .where(eq(integrationConnections.id, integration.id));
    } else {
      const result = await db
        .insert(integrationConnections)
        .values({
          type: "twinfield",
          data: sql`${{ refreshToken, accessToken, expiresOn }}::jsonb`,
        })
        .returning({
          id: integrationConnections.id,
          data: integrationConnections.data,
        });

      integration = result[0];
    }

    await db.insert(logs).values({
      type: "info",
      event: "integrationConnect",
      relationId,
      refType: "integration",
      refId: integration.id,
    });

    return { refreshToken, accessToken, expiresOn };
  } catch (error) {
    console.warn(error);

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
    .set({
      data: sql`${{
        ...integration.data,
        refreshToken,
        accessToken,
        expiresOn,
      }}::jsonb`,
    })
    .where(eq(integrationConnections.id, integration.id));

  await db.insert(logs).values({
    type: "info",
    event: "integrationRefreshAuth",
    refType: "integration",
    refId: integration.id,
  });

  return { refreshToken, accessToken, expiresOn };
};

// Rename to getIntegrationData with typed response
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

  return {
    id: integration.id,
    accessToken,
    companyCode: integration.data.companyCode,
  };
};

export const getTwinfieldWsdlUrl = async (accessToken: string) => {
  const clientSecret = process.env.TWINFIELD_CLIENT_SECRET;
  if (!clientSecret)
    throw new Error("Missing TWINFIELD_CLIENT_SECRET in .env.local");

  const { data } = await axios.get(
    `https://login.twinfield.com/auth/authentication/connect/accesstokenvalidation?token=${accessToken}`,
    {
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${clientSecret}`,
      },
    },
  );

  return data["twf.clusterUrl"] + "/webservices/processxml.asmx?wsdl";
};
