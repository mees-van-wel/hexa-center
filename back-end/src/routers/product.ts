import { eq } from "drizzle-orm";
import { number } from "valibot";

import { wrap } from "@typeschema/valibot";

import { productInstances, productTemplates } from "~/db/schema";
import { procedure, router } from "~/trpc";

export const productRouter = router({
  list: procedure.query(({ ctx }) =>
    ctx.db
      .select({
        $kind: productTemplates.$kind,
        id: productTemplates.id,
        revenueAccountId: productTemplates.revenueAccountId,
        name: productTemplates.name,
        price: productTemplates.price,
        vatRate: productTemplates.vatRate,
      })
      .from(productTemplates),
  ),
  deleteInstance: procedure
    .input(wrap(number()))
    .mutation(({ input, ctx }) =>
      ctx.db.delete(productInstances).where(eq(productInstances.id, input)),
    ),
});
