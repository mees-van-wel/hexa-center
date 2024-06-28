import { paymentTerms } from "~/db/schema";
import { procedure, router } from "~/trpc";

export const paymentTermRouter = router({
  list: procedure.query(({ ctx }) => ctx.db.select().from(paymentTerms)),
});
