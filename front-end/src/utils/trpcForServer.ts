"use server";

import { cookies, headers } from "next/headers";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { isProduction } from "./environment";
import { AppRouter } from "./trpc";
import { trpcTransformer } from "./trpcTransformer";

export const getTrpcClientOnServer = () => {
  const host = headers().get("host");

  if (isProduction && !host) throw new Error("Missing host header");

  const subdomain = host?.split(".")[0];
  const refreshToken = cookies().get(`refreshToken_${subdomain}`)?.value;

  return createTRPCProxyClient<AppRouter>({
    transformer: trpcTransformer,
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
        headers: () => ({
          ...(refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {}),
          ...(isProduction ? { origin: `https://${host}/` } : {}),
        }),
        fetch: (url, options) =>
          fetch(url, {
            ...options,
            credentials: "include",
          }),
      }),
    ],
  });
};
