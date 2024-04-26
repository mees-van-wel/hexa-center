"use server";

import { cookies, headers } from "next/headers";

import { AppRouter } from "@/app/trpc";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

import { isProduction } from "./environment";
import { trpcTransformer } from "./trpcTransformer";

export const getTrpcClientOnServer = () => {
  const host = headers().get("host");

  if (isProduction && !host) throw new Error("Missing host header");

  const subdomain = isProduction ? host?.split(".")[0] : "hexa-center";
  const refreshToken = cookies().get(`refreshToken_${subdomain}`)?.value;

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
        transformer: trpcTransformer,
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
