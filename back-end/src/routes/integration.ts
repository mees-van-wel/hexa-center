import { eq } from "drizzle-orm";
import { picklist, string } from "valibot";

import db from "@/db/client";
import { integrationConnections } from "@/db/schema";
import { connectTwinfield } from "@/services/integration";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";

export const integrationRouter = router({
  list: procedure.query(() =>
    db
      .select({ type: integrationConnections.type })
      .from(integrationConnections),
  ),
  get: procedure
    .input(wrap(picklist(["twinfield"])))
    .query(async ({ input: type }) => {
      const result = await db
        .select({ type: integrationConnections.type })
        .from(integrationConnections)
        .where(eq(integrationConnections.type, type));
      const integration = result[0];
      return integration as typeof integration | undefined;
    }),
  connectTwinfield: procedure
    .input(wrap(string()))
    .mutation(async ({ input: code, ctx }) => {
      await connectTwinfield(code, ctx.relation.id);
    }),
});
