import db from "@/db/client";
import { ledgerAccounts } from "@/db/schema";
import { procedure, router } from "@/trpc";

export const ledgerAccountRouter = router({
  list: procedure.query(() => db.select().from(ledgerAccounts)),
});
