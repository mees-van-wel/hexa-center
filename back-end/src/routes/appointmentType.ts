import { eq } from "drizzle-orm";
import { number } from "valibot";

import db from "@/db/client";
import { appointmentTypes } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";
import {
  AppointmentTypeCreateSchema,
  AppointmentTypeUpdateSchema,
} from "@front-end/schemas/appointmentType";
import { TRPCError } from "@trpc/server";

export const appointmentTypeRouter = router({
  create: procedure
    .input(wrap(AppointmentTypeCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .insert(appointmentTypes)
        .values({
          ...input,
          createdById: ctx.relation.id,
          updatedById: ctx.relation.id,
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
  list: procedure.query(() =>
    db
      .select({
        $kind: appointmentTypes.$kind,
        id: appointmentTypes.id,
        name: appointmentTypes.name,
        color: appointmentTypes.color,
      })
      .from(appointmentTypes),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const result = await db
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
      const result = await db
        .update(appointmentTypes)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedById: ctx.relation.id,
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
    .mutation(({ input }) =>
      db.delete(appointmentTypes).where(eq(appointmentTypes.id, input)),
    ),
});
