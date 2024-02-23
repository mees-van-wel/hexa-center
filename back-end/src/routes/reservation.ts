import { eq } from "drizzle-orm";
import { number } from "valibot";

import { wrap } from "@decs/typeschema";
import {
  ReservationCreateSchema,
  ReservationUpdateSchema,
} from "@front-end/schemas/reservation.js";
import { TRPCError } from "@trpc/server";

import db from "../db/client.js";
import { reservations } from "../db/schema.js";
import { procedure, router } from "../trpc.js";

export const reservationRouter = router({
  create: procedure
    .input(wrap(ReservationCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .insert(reservations)
        .values({
          ...input,
          createdById: ctx.relation.id,
          updatedById: ctx.relation.id,
        })
        .returning({
          $kind: reservations.$kind,
          id: reservations.id,
          createdAt: reservations.createdAt,
          createdById: reservations.createdById,
          updatedAt: reservations.updatedAt,
          updatedById: reservations.updatedById,
          roomId: reservations.roomId,
          customerId: reservations.customerId,
          startDate: reservations.startDate,
          endDate: reservations.endDate,
          notes: reservations.notes,
          guestName: reservations.guestName,
        });

      const reservation = result[0];
      if (!reservation) throw new TRPCError({ code: "NOT_FOUND" });

      return reservation;
    }),
  list: procedure.query(() =>
    db.query.reservations.findMany({
      with: {
        customer: true,
        room: true,
      },
    }),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const reservation = await db.query.reservations.findFirst({
      where: eq(reservations.id, input),
      with: {
        customer: true,
        room: true,
      },
    });

    if (!reservation) throw new TRPCError({ code: "NOT_FOUND" });

    return reservation;
  }),
  update: procedure
    .input(wrap(ReservationUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .update(reservations)
        .set({
          ...input,
          updatedById: ctx.relation.id,
        })
        .where(eq(reservations.id, input.id))
        .returning({
          $kind: reservations.$kind,
          id: reservations.id,
          createdAt: reservations.createdAt,
          createdById: reservations.createdById,
          updatedAt: reservations.updatedAt,
          updatedById: reservations.updatedById,
          roomId: reservations.roomId,
          customerId: reservations.customerId,
          startDate: reservations.startDate,
          endDate: reservations.endDate,
          notes: reservations.notes,
          guestName: reservations.guestName,
        });

      const reservation = result[0];
      if (!reservation) throw new TRPCError({ code: "NOT_FOUND" });

      return reservation;
    }),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input }) =>
      db.delete(reservations).where(eq(reservations.id, input)),
    ),
});
