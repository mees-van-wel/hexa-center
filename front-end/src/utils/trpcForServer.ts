"use server";

import { cookies, headers } from "next/headers";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { isProduction } from "./environment";
import { AppRouter } from "./trpc";
import { trpcTransformer } from "./trpcTransformer";

export const getTrpcClientOnServer = () => {
  const refreshToken = cookies().get("refreshToken")?.value;
  const host = headers().get("host");
  // const subdomain = host?.split(".")[0];

  if (isProduction && !host) throw new Error("Missing host header");

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
