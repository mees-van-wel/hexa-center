"use server";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { cookies, headers } from "next/headers";
import superjson from "superjson";

import { isProduction } from "./environment";
import { AppRouter } from "./trpc";

export const getTrpcClientOnServer = () => {
  const host = headers().get("host");

  if (isProduction && !host) throw new Error("Missing host header");

  const subdomain = isProduction ? host?.split(".")[0] : "hexa-center";
  const refreshToken = cookies().get(`refreshToken_${subdomain}`)?.value;

  return createTRPCProxyClient<AppRouter>({
    transformer: superjson,
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
