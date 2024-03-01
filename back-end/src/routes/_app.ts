import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "../trpc";

import { authRouter } from "./auth";
import { invoiceRouter } from "./invoice";
import { invoiceExtraRouter } from "./invoiceExtra";
import { relationRouter } from "./relation";
import { reservationRouter } from "./reservation";
import { roomRouter } from "./room";

export const appRouter = router({
  auth: authRouter,
  relation: relationRouter,
  room: roomRouter,
  reservation: reservationRouter,
  invoice: invoiceRouter,
  invoiceExtra: invoiceExtraRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
