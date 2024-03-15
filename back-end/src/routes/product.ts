import { eq } from "drizzle-orm";
import { number } from "valibot";

import db from "@/db/client";
import { productInstances, productTemplates } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";

export const productRouter = router({
  list: procedure.query(() =>
    db
      .select({
        $kind: productTemplates.$kind,
        id: productTemplates.id,
        name: productTemplates.name,
        price: productTemplates.price,
        vatRate: productTemplates.vatRate,
      })
      .from(productTemplates),
  ),
  deleteInstance: procedure
    .input(wrap(number()))
    .mutation(async ({ input }) =>
      db.delete(productInstances).where(eq(productInstances.id, input)),
    ),
});
