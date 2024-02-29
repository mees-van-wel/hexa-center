import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { date, number, object } from "valibot";

import db from "@/db/client";
import {
  invoiceEvents,
  invoiceLines,
  invoices,
  properties,
  relations,
  reservationsToInvoices,
} from "@/db/schema";
import { generateInvoicePdf, getInvoice } from "@/services/invoice";
import { getSettings } from "@/services/setting";
import { procedure, router } from "@/trpc";
import { sendMail } from "@/utils/mail";
import { wrap } from "@decs/typeschema";
import { TRPCError } from "@trpc/server";

dayjs.extend(duration);

export const invoiceRouter = router({
  list: procedure.query(() =>
    db.query.invoices.findMany({
      with: {
        customer: {
          columns: {
            name: true,
          },
        },
      },
      columns: {
        $kind: true,
        id: true,
        type: true,
        status: true,
        number: true,
        customerName: true,
        createdAt: true,
        date: true,
        grossAmount: true,
      },
      orderBy: desc(invoices.date),
    }),
  ),
  get: procedure
    .input(wrap(number()))
    .query(async ({ input }) => getInvoice(input)),
  issue: procedure
    .input(
      wrap(
        object({
          invoiceId: number(),
          date: date(),
        }),
      ),
    )
    .mutation(async ({ input: { invoiceId, date }, ctx }) => {
      const invoicesResult = await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, invoiceId));

      const invoice = invoicesResult[0];

      if (!invoice)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `invoice ${invoiceId} not found`,
        });

      if (!invoice.customerId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing customer id",
        });

      if (!invoice.companyId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing company id",
        });

      const [
        relationsResult,
        propertiesResult,
        {
          companyPaymentTerms,
          companyVatNumber,
          companyCocNumber,
          companyIban,
          companySwiftBic,
        },
        countResult,
      ] = await Promise.all([
        db.select().from(relations).where(eq(relations.id, invoice.customerId)),
        db
          .select()
          .from(properties)
          .where(eq(properties.id, invoice.companyId)),
        getSettings([
          "companyPaymentTerms",
          "companyVatNumber",
          "companyCocNumber",
          "companyIban",
          "companySwiftBic",
        ]),
        db
          .select({
            count: sql<number>`CAST(COUNT(*) AS INT)`,
          })
          .from(invoices)
          .where(
            and(
              sql`EXTRACT(YEAR FROM ${invoices.date}) = ${date.getFullYear()}`,
              or(eq(invoices.type, "standard"), eq(invoices.type, "final")),
            ),
          ),
      ]);

      const customer = relationsResult[0];
      if (!customer)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `customer ${invoice.customerId} not found`,
        });

      const company = propertiesResult[0];
      if (!company)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `company ${invoice.companyId} not found`,
        });

      const { count } = countResult[0];

      // TODO only update when empty (customer/company)

      await db
        .update(invoices)
        .set({
          status: "issued",
          date,
          dueDate:
            invoice.type !== "credit" && invoice.type !== "quotation"
              ? dayjs(date).add(dayjs.duration(companyPaymentTerms)).toDate()
              : undefined,
          number:
            invoice.number ||
            date.getFullYear() + (count + 1).toString().padStart(4, "0"),
          customerName: customer.name,
          customerEmailAddress: customer.emailAddress,
          customerPhoneNumber: customer.phoneNumber,
          customerStreet: customer.street,
          customerHouseNumber: customer.houseNumber,
          customerPostalCode: customer.postalCode,
          customerCity: customer.city,
          customerRegion: customer.region,
          customerCountry: customer.country,
          customerVatNumber: customer.vatNumber,
          customerCocNumber: customer.cocNumber,
          companyName: company.name,
          companyEmailAddress: company.emailAddress,
          companyPhoneNumber: company.phoneNumber,
          companyStreet: company.street,
          companyHouseNumber: company.houseNumber,
          companyPostalCode: company.postalCode,
          companyCity: company.city,
          companyRegion: company.region,
          companyCountry: company.country,
          companyVatNumber,
          companyCocNumber,
          companyIban,
          companySwiftBic,
        })
        .where(eq(invoices.id, invoiceId));

      await db.insert(invoiceEvents).values({
        createdById: ctx.relation.id,
        invoiceId,
        type: "issued",
      });
    }),
  generatePdf: procedure
    .input(wrap(number()))
    .mutation(async ({ input }) => (await generateInvoicePdf(input)).base64),
  mail: procedure.input(wrap(number())).mutation(async ({ input, ctx }) => {
    const { invoice, base64 } = await generateInvoicePdf(input);

    const { invoiceEmailTitle, invoiceEmailContent } = await getSettings([
      "invoiceEmailTitle",
      "invoiceEmailContent",
    ]);

    if (!invoiceEmailTitle || !invoiceEmailContent)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing invoice email settings",
      });

    const name = invoice.customerName || invoice.customer?.name;
    const emailAddress =
      invoice.customerEmailAddress || invoice.customer?.emailAddress;

    if (!name || !emailAddress)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing customer name or email address",
      });

    await sendMail({
      title: invoiceEmailTitle,
      to: {
        name,
        emailAddress,
      },
      attachments: [
        {
          Name:
            (invoice.type === "quotation"
              ? "Quotation"
              : invoice.type === "credit"
                ? "Credit Invoice"
                : "Invoice") +
            " " +
            invoice.number +
            ".pdf",
          ContentID: `invoice:${invoice.id}`,
          Content: base64,
          ContentType: "application/pdf",
        },
      ],
      template: "invoice",
      variables: {
        message: invoiceEmailContent,
      },
    });

    await db.insert(invoiceEvents).values({
      createdById: ctx.relation.id,
      invoiceId: input,
      type: "mailed",
    });
  }),
  // TOOD Make credit invoice be issued right away
  credit: procedure.input(wrap(number())).mutation(async ({ input, ctx }) => {
    const invoicesResult = await db
      .select({
        refType: invoices.refType,
        refId: invoices.refId,
        netAmount: invoices.netAmount,
        vatAmount: invoices.vatAmount,
        grossAmount: invoices.grossAmount,
        number: invoices.number,
        notes: invoices.notes,
        customerId: invoices.customerId,
        companyId: invoices.companyId,
      })
      .from(invoices)
      .where(eq(invoices.id, input));
    const invoice = invoicesResult[0];

    if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });

    const [createCreditInvoiceResponse, invoiceLinesResult] = await Promise.all(
      [
        db
          .insert(invoices)
          .values({
            createdById: ctx.relation.id,
            refType: invoice.refType,
            refId: invoice.refId,
            type: "credit",
            status: "draft",
            netAmount: "-" + invoice.netAmount,
            vatAmount: "-" + invoice.vatAmount,
            grossAmount: "-" + invoice.grossAmount,
            number: invoice.number + "-C",
            notes: invoice.notes,
            customerId: invoice.customerId,
            companyId: invoice.companyId,
          })
          .returning({ id: invoices.id }),
        db
          .select({
            name: invoiceLines.name,
            unitAmount: invoiceLines.unitAmount,
            quantity: invoiceLines.quantity,
            netAmount: invoiceLines.netAmount,
            vatAmount: invoiceLines.vatAmount,
            vatPercentage: invoiceLines.vatPercentage,
            grossAmount: invoiceLines.grossAmount,
          })
          .from(invoiceLines)
          .where(eq(invoiceLines.invoiceId, input)),
        db
          .update(invoices)
          .set({
            status: "credited",
          })
          .where(eq(invoices.id, input)),
      ],
    );

    const creditInvoiceId = createCreditInvoiceResponse[0].id;

    await Promise.all([
      db.insert(invoiceLines).values(
        invoiceLinesResult.map((invoiceLine) => ({
          invoiceId: creditInvoiceId,
          name: invoiceLine.name,
          unitAmount: "-" + invoiceLine.unitAmount,
          quantity: invoiceLine.quantity,
          netAmount: "-" + invoiceLine.netAmount,
          vatAmount: "-" + invoiceLine.vatAmount,
          vatPercentage: invoiceLine.vatPercentage,
          grossAmount: "-" + invoiceLine.grossAmount,
        })),
      ),
      db.insert(invoiceEvents).values({
        invoiceId: input,
        type: "credited",
        createdById: ctx.relation.id,
        refType: "invoice",
        refId: creditInvoiceId,
      }),
    ]);

    if (invoice.refType === "reservation") {
      const reservationsToInvoicesResult = await db
        .select()
        .from(reservationsToInvoices)
        .where(
          and(
            eq(reservationsToInvoices.invoiceId, input),
            eq(reservationsToInvoices.reservationId, invoice.refId),
          ),
        );

      const reservationsToInvoice = reservationsToInvoicesResult[0];

      await db.insert(reservationsToInvoices).values({
        ...reservationsToInvoice,
        invoiceId: creditInvoiceId,
      });
    }

    return creditInvoiceId;
  }),
  delete: procedure
    .input(wrap(number()))
    .mutation(async ({ input }) =>
      db.delete(invoices).where(eq(invoices.id, input)),
    ),
});
