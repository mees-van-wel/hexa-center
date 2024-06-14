import { router } from "~/trpc";

import { appointmentTypeRouter } from "./appointmentType";
import { authRouter } from "./auth";
import { businessRouter } from "./business";
import { customerRouter } from "./customer";
import { formRouter } from "./form";
import { integrationRouter } from "./integration";
import { invoiceRouter } from "./invoice";
import { ledgerAccountRouter } from "./ledgerAccount";
import { paymentTermRouter } from "./paymentTerm";
import { productRouter } from "./product";
import { reservationRouter } from "./reservation";
import { roomRouter } from "./room";
import { settingRouter } from "./setting";
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
  paymentTerm: paymentTermRouter,
  setting: settingRouter,
  form: formRouter,
});

export type AppRouter = typeof appRouter;
