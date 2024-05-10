import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import type { AppRouter as AR } from "~/routers/_app";

export type AppRouter = AR;
export type RouterInput = inferRouterInputs<AR>;
export type RouterOutput = inferRouterOutputs<AR>;

export const getTrpcClient = () => {
  // const subdomain = window.location.hostname.split(".")[0];
  // if (isProduction && !subdomain) throw new Error("Missing subdomain");

  return createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: "http://localhost:4000/trpc",
        // headers: isProduction
        //   ? () => ({
        //       "X-Subdomain": subdomain,
        //     })
        //   : undefined,
        fetch: (url, options) =>
          fetch(url, {
            ...options,
            credentials: "include",
          }),
      }),
    ],
  });
};

// const client = getTrpcClient();

// (async () => {
//   const a = await client.business.create.mutate();
// })();
