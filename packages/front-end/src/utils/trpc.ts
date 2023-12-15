import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter, RI, RO } from "@hexa-center/back-end/src/routes/_app";
import { trpcTransformer } from "@hexa-center/shared/utils/trpcTransformer";

export type RouterInput = RI;
export type RouterOutput = RO;

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
