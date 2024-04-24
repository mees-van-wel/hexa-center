import { eq } from "drizzle-orm";
import { number } from "valibot";

import { userAccountDetailsWorkingHours } from "@/db/schema";
import {
  WorkingHourCreateSchema,
  WorkingHourUpdateSchema,
} from "@/schemas/workingHour";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";
import { TRPCError } from "@trpc/server";

export const workingHourRouter = router({
  create: procedure
    .input(wrap(WorkingHourCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(userAccountDetailsWorkingHours)
        .values({
          ...input,
        })
        .returning({
          accountId: userAccountDetailsWorkingHours.accountId,
          startDay: userAccountDetailsWorkingHours.startDay,
          endDay: userAccountDetailsWorkingHours.endDay,
          startTime: userAccountDetailsWorkingHours.startTime,
          endTime: userAccountDetailsWorkingHours.endTime,
        });

      return result[0];
    }),
  list: procedure.query(({ ctx }) =>
    ctx.db
      .select({
        id: userAccountDetailsWorkingHours.id,
      })
      .from(userAccountDetailsWorkingHours),
  ),
  get: procedure.input(wrap(number())).query(async ({ input, ctx }) => {
    const result = await ctx.db
      .select({
        id: userAccountDetailsWorkingHours.id,
      })
      .from(userAccountDetailsWorkingHours)
      .where(eq(userAccountDetailsWorkingHours.id, input));

    const workingHour = result[0];

    if (!workingHour) throw new TRPCError({ code: "NOT_FOUND" });

    return workingHour;
  }),
  update: procedure
    .input(wrap(WorkingHourUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(userAccountDetailsWorkingHours)
        .set({
          ...input,
        })
        .where(eq(userAccountDetailsWorkingHours.id, input.id))
        .returning({
          id: userAccountDetailsWorkingHours.id,
        });

      return result[0];
    }),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input, ctx }) =>
      ctx.db
        .delete(userAccountDetailsWorkingHours)
        .where(eq(userAccountDetailsWorkingHours.id, input)),
    ),
});
