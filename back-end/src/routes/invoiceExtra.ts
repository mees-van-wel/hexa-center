import { eq } from "drizzle-orm";
import { number } from "valibot";

import db from "@/db/client";
import { invoiceExtraInstances, invoiceExtraTemplates } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";

export const invoiceExtraRouter = router({
  list: procedure.query(() =>
    db
      .select({
        $kind: invoiceExtraTemplates.$kind,
        id: invoiceExtraTemplates.id,
        name: invoiceExtraTemplates.name,
        quantity: invoiceExtraTemplates.quantity,
        amount: invoiceExtraTemplates.amount,
        unit: invoiceExtraTemplates.unit,
        vatRate: invoiceExtraTemplates.vatRate,
      })
      .from(invoiceExtraTemplates),
  ),
  deleteInstance: procedure
    .input(wrap(number()))
    .mutation(async ({ input }) =>
      db
        .delete(invoiceExtraInstances)
        .where(eq(invoiceExtraInstances.id, input)),
    ),
});
