import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { date, number, object } from "valibot";

import db from "@/db/client";
import { reservations, reservationsToInvoices } from "@/db/schema";
import { createInvoice } from "@/services/invoice";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";
import {
  ReservationCreateSchema,
  ReservationUpdateSchema,
} from "@front-end/schemas/reservation";
import { TRPCError } from "@trpc/server";

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
      with: {
        customer: true,
        room: true,
        reservationsToInvoices: {
          with: {
            invoice: {
              columns: {
                $kind: true,
                id: true,
                createdAt: true,
                type: true,
                status: true,
                number: true,
                date: true,
                totalGrossAmount: true,
              },
            },
          },
        },
      },
      where: eq(reservations.id, input),
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
  invoicePeriod: procedure
    .input(
      wrap(
        object({
          reservationId: number(),
          startDate: date(),
          endDate: date(),
        }),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const reservation = await db.query.reservations.findFirst({
        with: {
          room: true,
        },
        where: eq(reservations.id, input.reservationId),
      });

      if (!reservation) throw new TRPCError({ code: "NOT_FOUND" });

      const totalNights = dayjs(input.endDate).diff(
        dayjs(input.startDate),
        "days",
      );

      const invoiceId = await createInvoice({
        createdById: ctx.relation.id,
        refType: "reservation",
        refId: input.reservationId,
        type: "standard",
        customerId: reservation.customerId,
        companyId: ctx.relation.propertyId,
        lines: [
          {
            name: "Overnight Stays",
            unitNetAmount: reservation.room.price,
            quantity: totalNights.toString(),
            taxPercentage: "21",
          },
        ],
      });

      await db.insert(reservationsToInvoices).values({
        reservationId: reservation.id,
        invoiceId,
        startDate: input.startDate,
        endDate: input.endDate,
      });

      return invoiceId;
    }),
});
