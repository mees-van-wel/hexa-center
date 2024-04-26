import { trpcTransformer } from "@/utils/trpcTransformer";
import type { AppRouter as AR } from "@back-end/routes/app";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type AppRouter = AR;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
      transformer: trpcTransformer,
    }),
  ],
});

client.business;
