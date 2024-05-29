import { router } from "~/trpc";

import { appointmentTypeRouter } from "./appointmentType";
import { authRouter } from "./auth";
import { businessRouter } from "./business";
import { customerRouter } from "./customer";
import { integrationRouter } from "./integration";
import { invoiceRouter } from "./invoice";
import { ledgerAccountRouter } from "./ledgerAccount";
import { productRouter } from "./product";
import { reservationRouter } from "./reservation";
import { roomRouter } from "./room";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  business: businessRouter,
  user: userRouter,
  appointmentType: appointmentTypeRouter,
  room: roomRouter,
  reservation: reservationRouter,
  customer: customerRouter,
  invoice: invoiceRouter,
  product: productRouter,
  ledgerAccount: ledgerAccountRouter,
  integration: integrationRouter,
});

export type AppRouter = typeof appRouter;
