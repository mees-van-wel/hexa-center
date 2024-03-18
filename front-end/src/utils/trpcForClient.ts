"use client";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { isProduction } from "./environment";
import { AppRouter } from "./trpc";
import { trpcTransformer } from "./trpcTransformer";

export const getTrpcClientOnClient = () => {
  const subdomain = window.location.hostname.split(".")[0];

  if (isProduction && !subdomain) throw new Error("Missing subdomain");

  return createTRPCProxyClient<AppRouter>({
    transformer: trpcTransformer,
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
        headers: isProduction
          ? () => ({
              "X-Subdomain": subdomain,
            })
          : undefined,
        fetch: (url, options) =>
          fetch(url, {
            ...options,
            credentials: "include",
          }),
      }),
    ],
  });
};
