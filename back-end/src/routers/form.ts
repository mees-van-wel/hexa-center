import { wrap } from "@typeschema/valibot";
import { eq } from "drizzle-orm";
import { number } from "valibot";

import { forms } from "~/db/schema";
import { procedure, router } from "~/trpc";

export const formRouter = router({
  get: procedure.input(wrap(number())).query(async ({ input, ctx }) => {
    const response = await ctx.db.query.forms.findFirst({
      where: eq(forms.id, input),
      with: {
        sections: {
          with: {
            elements: {
              with: {
                values: true,
              },
            },
          },
        },
      },
    });

    return response!;
  }),
});
