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
        revenueAccountId: productTemplates.revenueAccountId,
        name: productTemplates.name,
        price: productTemplates.price,
        vatRate: productTemplates.vatRate,
      })
      .from(productTemplates),
  ),
  deleteInstance: procedure
    .input(wrap(number()))
    .mutation(async ({ input }) => {
      await db.delete(productInstances).where(eq(productInstances.id, input));

      // try {
      //   await db
      //     .delete(integrationMappings)
      //     .where(
      //       and(
      //         eq(integrationMappings.refType, "productInstance"),
      //         eq(integrationMappings.refId, input),
      //       ),
      //     );
      // } catch (error) {
      //   console.warn(
      //     `Error while trying to delete integration mapping for product instance: ${input}`,
      //     error,
      //   );
      // }
    }),
});
