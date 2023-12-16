import { router } from "@/trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { authRouter } from "./auth";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export type RI = inferRouterInputs<AppRouter>;
export type RO = inferRouterOutputs<AppRouter>;
