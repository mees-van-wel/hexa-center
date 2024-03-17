import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "../trpc";

import { authRouter } from "./auth";
import { customerRouter } from "./customer";
import { integrationRouter } from "./integration";
import { invoiceRouter } from "./invoice";
import { ledgerAccountRouter } from "./ledgerAccount";
import { productRouter } from "./product";
import { propertyRouter } from "./property";
import { reservationRouter } from "./reservation";
import { roomRouter } from "./room";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  property: propertyRouter,
  user: userRouter,
  room: roomRouter,
  reservation: reservationRouter,
  customer: customerRouter,
  invoice: invoiceRouter,
  product: productRouter,
  ledgerAccount: ledgerAccountRouter,
  integration: integrationRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
