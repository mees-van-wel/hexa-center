import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "../trpc";

import { authRouter } from "./auth";
import { integrationRouter } from "./integration";
import { invoiceRouter } from "./invoice";
import { invoiceExtraRouter } from "./invoiceExtra";
import { propertyRouter } from "./property";
import { relationRouter } from "./relation";
import { reservationRouter } from "./reservation";
import { roomRouter } from "./room";

export const appRouter = router({
  auth: authRouter,
  property: propertyRouter,
  relation: relationRouter,
  room: roomRouter,
  reservation: reservationRouter,
  invoice: invoiceRouter,
  invoiceExtra: invoiceExtraRouter,
  integration: integrationRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
