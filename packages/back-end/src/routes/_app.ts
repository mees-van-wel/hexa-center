import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc.js";

import { authRouter } from "./auth.js";

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
export type RI = inferRouterInputs<AppRouter>;
export type RO = inferRouterOutputs<AppRouter>;
