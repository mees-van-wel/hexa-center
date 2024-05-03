import { eq } from "drizzle-orm";
import { number } from "valibot";

import { appointmentTypes } from "@/db/schema";
import {
  AppointmentTypeCreateSchema,
  AppointmentTypeUpdateSchema,
} from "@/schemas/appointmentType";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";
import { TRPCError } from "@trpc/server";

export const appointmentTypeRouter = router({
  create: procedure
    .input(wrap(AppointmentTypeCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(appointmentTypes)
        .values({
          ...input,
          createdById: ctx.user.id,
          updatedById: ctx.user.id,
        })
        .returning({
          $kind: appointmentTypes.$kind,
          id: appointmentTypes.id,
          createdAt: appointmentTypes.createdAt,
          createdById: appointmentTypes.createdById,
          updatedAt: appointmentTypes.updatedAt,
          updatedById: appointmentTypes.updatedById,
          name: appointmentTypes.name,
          color: appointmentTypes.color,
          appointmentDescription: appointmentTypes.appointmentDescription,
          appointmentDuration: appointmentTypes.appointmentDuration,
        });

      return result[0];
    }),
  list: procedure.query(({ ctx }) =>
    ctx.db
      .select({
        $kind: appointmentTypes.$kind,
        id: appointmentTypes.id,
        name: appointmentTypes.name,
        color: appointmentTypes.color,
      })
      .from(appointmentTypes),
  ),
  get: procedure.input(wrap(number())).query(async ({ input, ctx }) => {
    const result = await ctx.db
      .select({
        $kind: appointmentTypes.$kind,
        id: appointmentTypes.id,
        createdAt: appointmentTypes.createdAt,
        createdById: appointmentTypes.createdById,
        updatedAt: appointmentTypes.updatedAt,
        updatedById: appointmentTypes.updatedById,
        name: appointmentTypes.name,
        color: appointmentTypes.color,
        appointmentDescription: appointmentTypes.appointmentDescription,
        appointmentDuration: appointmentTypes.appointmentDuration,
      })
      .from(appointmentTypes)
      .where(eq(appointmentTypes.id, input));

    const appointmentType = result[0];

    if (!appointmentType) throw new TRPCError({ code: "NOT_FOUND" });

    return appointmentType;
  }),
  update: procedure
    .input(wrap(AppointmentTypeUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(appointmentTypes)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedById: ctx.user.id,
        })
        .where(eq(appointmentTypes.id, input.id))
        .returning({
          $kind: appointmentTypes.$kind,
          id: appointmentTypes.id,
          createdAt: appointmentTypes.createdAt,
          createdById: appointmentTypes.createdById,
          updatedAt: appointmentTypes.updatedAt,
          updatedById: appointmentTypes.updatedById,
          name: appointmentTypes.name,
          color: appointmentTypes.color,
          appointmentDescription: appointmentTypes.appointmentDescription,
          appointmentDuration: appointmentTypes.appointmentDuration,
        });

      return result[0];
    }),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input, ctx }) =>
      ctx.db.delete(appointmentTypes).where(eq(appointmentTypes.id, input)),
    ),
});
