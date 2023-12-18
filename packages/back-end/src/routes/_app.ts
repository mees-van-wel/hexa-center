import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc.js";

import { authRouter } from "./auth.js";
import { userRouter } from "./user.js";
import { roomRouter } from "./room.js";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  room: roomRouter,
});

export type AppRouter = typeof appRouter;
export type RI = inferRouterInputs<AppRouter>;
export type RO = inferRouterOutputs<AppRouter>;
