import { ledgerAccounts } from "~/db/schema";
import { procedure, router } from "~/trpc";

export const ledgerAccountRouter = router({
  list: procedure.query(({ ctx }) => ctx.db.select().from(ledgerAccounts)),
});
