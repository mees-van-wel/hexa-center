import { eq } from "drizzle-orm";
import { number } from "valibot";

import { wrap } from "@decs/typeschema";
import { TRPCError } from "@trpc/server";

import db from "../db/client.js";
import { reservations, rooms, users } from "../db/schema.js";
import {
  ReservationCreateSchema,
  ReservationUpdateSchema,
} from "../schemas/reservation.js";
import { procedure, router } from "../trpc.js";

export const reservationRouter = router({
  create: procedure
    .input(wrap(ReservationCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .insert(reservations)
        .values({
          ...input,
          createdById: ctx.user.id,
          updatedById: ctx.user.id,
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
    db
      .select({
        id: reservations.id,
        roomId: reservations.roomId,
        customerId: reservations.customerId,
        startDate: reservations.startDate,
        endDate: reservations.endDate,
        notes: reservations.notes,
        guestName: reservations.guestName,
        customer: { firstName: users.firstName, lastName: users.lastName },
        room: { name: rooms.name },
      })
      .from(reservations)
      .innerJoin(users, eq(reservations.customerId, users.id))
      .innerJoin(rooms, eq(reservations.roomId, rooms.id)),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const result = await db
      .select({
        id: reservations.id,
        roomId: reservations.roomId,
        customerId: reservations.customerId,
        startDate: reservations.startDate,
        endDate: reservations.endDate,
        notes: reservations.notes,
        guestName: reservations.guestName,
        user: { firstName: users.firstName, lastName: users.lastName },
      })
      .from(reservations)
      .innerJoin(users, eq(reservations.customerId, users.id))
      .where(eq(reservations.id, input));

    const reservation = result[0];
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
          updatedById: ctx.user.id,
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
