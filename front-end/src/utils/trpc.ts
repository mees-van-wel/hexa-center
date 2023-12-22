import { trpcTransformer } from "@/utils/trpcTransformer";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { appRouter } from "../../../back-end/src/routes/_app";

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

let TRPCRefreshToken: string | undefined;

export function setTRPCRefreshToken(newToken: string) {
  /**
   * You can also save the token to cookies, and initialize from
   * cookies above.
   */
  TRPCRefreshToken = newToken;
}

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: trpcTransformer,
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
      headers() {
        return {
          Authorization: TRPCRefreshToken
            ? `Bearer ${TRPCRefreshToken}`
            : undefined,
        };
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
