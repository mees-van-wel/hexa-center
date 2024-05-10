import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter as AR } from "~/routers/_app";

export type AppRouter = AR;
export type RouterInput = inferRouterInputs<AR>;
export type RouterOutput = inferRouterOutputs<AR>;
