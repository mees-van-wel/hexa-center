import dayjs from "dayjs";
import Decimal from "decimal.js";
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
  productInstances,
  reservations,
  reservationsToInvoices,
  reservationsToProductInstances,
} from "@/db/schema";
import { createInvoice } from "@/services/invoice";
import { getSetting } from "@/services/setting";
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
        productInstancesJunction: {
          columns: {
            quantity: true,
            cycle: true,
            status: true,
          },
          with: {
            productInstance: {
              columns: {
                $kind: true,
                id: true,
                revenueAccountId: true,
                name: true,
                price: true,
                vatRate: true,
              },
            },
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

    return {
      ...reservation,
      // TODO Check if string conversion is necessary
      productInstancesJunction: reservation.productInstancesJunction.map(
        (junction) => ({
          ...junction,
          quantity: junction.quantity.toString(),
          productInstance: {
            ...junction.productInstance,
            price: junction.productInstance.price.toString(),
            vatRate: junction.productInstance.vatRate.toString(),
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
          updatedAt: new Date(),
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
          productInstancesJunction: {
            with: {
              productInstance: true,
            },
          },
        },
        where: eq(reservations.id, input.reservationId),
      });

      if (!reservation) throw new TRPCError({ code: "NOT_FOUND" });

      const extraLines: {
        revenueAccountId: number;
        name: string;
        unitAmount: string;
        quantity: string;
        vatRate: string;
      }[] = [];
      const isFinalInvoice = dayjs(reservation.endDate).isSame(input.endDate);
      const periodNights = dayjs(input.endDate).diff(input.startDate, "days");
      const totalNights = dayjs(reservation.endDate).diff(
        reservation.startDate,
        "days",
      );

      await Promise.all(
        reservation.productInstancesJunction.map(
          async ({ quantity, cycle, status, productInstance }) => {
            if (
              status === "fullyInvoiced" ||
              ((cycle === "oneTimeOnEnd" || cycle === "perNightOnEnd") &&
                !isFinalInvoice)
            )
              return;

            status = "fullyInvoiced";

            if (cycle === "perNightThroughout") {
              quantity = new Decimal(quantity).mul(periodNights).toString();
              status = isFinalInvoice ? "fullyInvoiced" : "partiallyInvoiced";
            }

            if (cycle === "perNightOnEnd")
              quantity = new Decimal(quantity).mul(totalNights).toString();

            await db
              .update(reservationsToProductInstances)
              .set({ status })
              .where(
                and(
                  eq(
                    reservationsToProductInstances.reservationId,
                    reservation.id,
                  ),
                  eq(
                    reservationsToProductInstances.productInstanceId,
                    productInstance.id,
                  ),
                ),
              );

            extraLines.push({
              revenueAccountId: productInstance.revenueAccountId,
              name: productInstance.name,
              unitAmount: productInstance.price,
              quantity,
              vatRate: productInstance.vatRate,
            });
          },
        ),
      );

      const reservationRevenueAccountId = await getSetting(
        "reservationRevenueAccountId",
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
            revenueAccountId: reservationRevenueAccountId,
            name: "Overnight Stays",
            unitAmount: reservation.priceOverride || reservation.room.price,
            quantity: periodNights.toString(),
            vatRate: "9",
          },
          ...extraLines,
        ],
      });

      await db.insert(reservationsToInvoices).values({
        reservationId: reservation.id,
        invoiceId,
        periodStartDate: input.startDate,
        periodEndDate: input.endDate,
      });

      return invoiceId;
    }),
  addProduct: procedure
    .input(
      wrap(
        object({
          reservationId: number(),
          templateId: nullable(number()),
          name: string(),
          price: string(),
          vatRate: string(),
          quantity: string(),
          revenueAccountId: number(),
          cycle: picklist([
            "oneTimeOnNext",
            "oneTimeOnEnd",
            "perNightThroughout",
            "perNightOnEnd",
          ]),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .insert(productInstances)
        .values({
          templateId: input.templateId,
          revenueAccountId: input.revenueAccountId,
          name: input.name,
          price: input.price,
          vatRate: input.vatRate,
        })
        .returning({ id: productInstances.id });

      const productInstanceId = result[0].id;

      await db.insert(reservationsToProductInstances).values({
        reservationId: input.reservationId,
        productInstanceId,
        quantity: input.quantity,
        cycle: input.cycle,
        status: "notInvoiced",
      });
    }),
  editProduct: procedure
    .input(
      wrap(
        object({
          reservationId: number(),
          instanceId: number(),
          name: optional(string()),
          price: optional(string()),
          vatRate: optional(string()),
          quantity: optional(string()),
          revenueAccountId: number(),
          cycle: optional(
            picklist([
              "oneTimeOnNext",
              "oneTimeOnEnd",
              "perNightThroughout",
              "perNightOnEnd",
            ]),
          ),
        }),
      ),
    )
    .mutation(({ input }) =>
      Promise.all([
        db
          .update(productInstances)
          .set({
            name: input.name,
            price: input.price,
            vatRate: input.vatRate,
            revenueAccountId: input.revenueAccountId,
          })
          .where(eq(productInstances.id, input.instanceId)),
        db
          .update(reservationsToProductInstances)
          .set({
            quantity: input.quantity,
            cycle: input.cycle,
          })
          .where(
            and(
              eq(
                reservationsToProductInstances.reservationId,
                input.reservationId,
              ),
              eq(
                reservationsToProductInstances.productInstanceId,
                input.instanceId,
              ),
            ),
          ),
      ]),
    ),
  resetProduct: procedure
    .input(
      wrap(
        object({
          reservationId: number(),
          productInstanceId: number(),
        }),
      ),
    )
    .mutation(({ input }) =>
      db
        .update(reservationsToProductInstances)
        .set({ status: "notInvoiced" })
        .where(
          and(
            eq(
              reservationsToProductInstances.reservationId,
              input.reservationId,
            ),
            eq(
              reservationsToProductInstances.productInstanceId,
              input.productInstanceId,
            ),
          ),
        ),
    ),
});
