import { router } from "../trpc";

import { authRouter } from "./auth";
import { invoiceRouter } from "./invoice";
import { relationRouter } from "./relation";
import { roomRouter } from "./room";

export const appRouter = router({
  auth: authRouter,
  relation: relationRouter,
  invoice: invoiceRouter,
  room: roomRouter,
});
