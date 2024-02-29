import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import {
  date,
  nullable,
  number,
  object,
  optional,
  picklist,
  string,
} from "valibot";

import db from "@/db/client";
import {
  invoiceExtraInstances,
  reservations,
  reservationsToInvoiceExtraInstances,
  reservationsToInvoices,
} from "@/db/schema";
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
          priceOverride: input.priceOverride
            ? input.priceOverride.toString()
            : undefined,
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
          priceOverride: reservations.priceOverride,
          guestName: reservations.guestName,
          reservationNotes: reservations.reservationNotes,
          invoiceNotes: reservations.invoiceNotes,
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
        invoicesJunction: {
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
                grossAmount: true,
              },
            },
          },
        },
        invoicesExtrasJunction: {
          with: {
            instance: {
              columns: {
                $kind: true,
                id: true,
                name: true,
                quantity: true,
                amount: true,
                unit: true,
                vatPercentage: true,
              },
            },
          },
          columns: {
            basis: true,
            timing: true,
            status: true,
          },
        },
      },
      columns: {
        $kind: true,
        id: true,
        createdAt: true,
        createdById: true,
        updatedAt: true,
        updatedById: true,
        roomId: true,
        customerId: true,
        startDate: true,
        endDate: true,
        priceOverride: true,
        guestName: true,
        reservationNotes: true,
        invoiceNotes: true,
      },
    });

    if (!reservation) throw new TRPCError({ code: "NOT_FOUND" });

    reservation.invoicesExtrasJunction;

    return {
      ...reservation,
      invoicesExtrasJunction: reservation.invoicesExtrasJunction.map(
        (junction) => ({
          ...junction,
          instance: {
            ...junction.instance,
            amount: junction.instance.amount.toString(),
            quantity: junction.instance.quantity.toString(),
            vatPercentage: junction.instance.vatPercentage.toString(),
          },
        }),
      ),
    };
  }),
  update: procedure
    .input(wrap(ReservationUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .update(reservations)
        .set({
          ...input,
          updatedById: ctx.relation.id,
          priceOverride:
            input.priceOverride === null
              ? null
              : input.priceOverride
                ? input.priceOverride.toString()
                : undefined,
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
          priceOverride: reservations.priceOverride,
          guestName: reservations.guestName,
          reservationNotes: reservations.reservationNotes,
          invoiceNotes: reservations.invoiceNotes,
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
          invoicesExtrasJunction: true,
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
        notes: reservation.invoiceNotes,
        lines: [
          {
            name: "Overnight Stays",
            unitAmount: reservation.priceOverride || reservation.room.price,
            quantity: totalNights.toString(),
            vatPercentage: "9",
          },
          // ...invoiceExtras.map(({ name, amount }) => ({ name, unitNetAmount })),
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
  addInvoiceExtra: procedure
    .input(
      wrap(
        object({
          reservationId: number(),
          templateId: nullable(number()),
          name: string(),
          quantity: string(),
          amount: string(),
          unit: picklist(["currency"]),
          basis: picklist(["oneTime", "perNight"]),
          timing: picklist(["end", "throughout"]),
          vatPercentage: string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .insert(invoiceExtraInstances)
        .values({
          templateId: input.templateId,
          name: input.name,
          quantity: input.quantity,
          amount: input.amount,
          unit: input.unit,
          vatPercentage: input.vatPercentage,
        })
        .returning({
          id: invoiceExtraInstances.id,
        });

      const instanceId = result[0].id;

      await db.insert(reservationsToInvoiceExtraInstances).values({
        reservationId: input.reservationId,
        instanceId,
        basis: input.basis,
        timing: input.timing,
        status: "notApplied",
      });
    }),
  updateInvoiceExtra: procedure
    .input(
      wrap(
        object({
          reservationId: number(),
          instanceId: number(),
          name: optional(string()),
          quantity: string(),
          amount: optional(string()),
          unit: optional(picklist(["currency"])),
          basis: optional(picklist(["oneTime", "perNight"])),
          timing: optional(picklist(["end", "throughout"])),
          vatPercentage: optional(string()),
        }),
      ),
    )
    .mutation(async ({ input }) =>
      Promise.all([
        db
          .update(invoiceExtraInstances)
          .set({
            name: input.name,
            quantity: input.quantity,
            amount: input.amount,
            unit: input.unit,
            vatPercentage: input.vatPercentage,
          })
          .where(eq(invoiceExtraInstances.id, input.instanceId)),
        db
          .update(reservationsToInvoiceExtraInstances)
          .set({
            basis: input.basis,
            timing: input.timing,
          })
          .where(
            and(
              eq(
                reservationsToInvoiceExtraInstances.reservationId,
                input.reservationId,
              ),
              eq(
                reservationsToInvoiceExtraInstances.instanceId,
                input.instanceId,
              ),
            ),
          ),
      ]),
    ),
});
