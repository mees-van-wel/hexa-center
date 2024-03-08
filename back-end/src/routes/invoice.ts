import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import { and, desc, eq } from "drizzle-orm";
import { date, number, object } from "valibot";

import db from "@/db/client";
import {
  invoiceEvents,
  invoiceLines,
  invoices,
  reservationsToInvoices,
} from "@/db/schema";
import {
  generateInvoicePdf,
  getInvoice,
  invertDecimalString,
  issueInvoice,
} from "@/services/invoice";
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
    .mutation(({ input: { invoiceId, date }, ctx }) =>
      issueInvoice(invoiceId, date, ctx.relation.id),
    ),
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
            netAmount: invertDecimalString(invoice.netAmount),
            vatAmount: invertDecimalString(invoice.vatAmount),
            grossAmount: invertDecimalString(invoice.grossAmount),
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
            vatRate: invoiceLines.vatRate,
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
          unitAmount: invertDecimalString(invoiceLine.unitAmount),
          quantity: invoiceLine.quantity,
          netAmount: invertDecimalString(invoiceLine.netAmount),
          vatAmount: invertDecimalString(invoiceLine.vatAmount),
          vatRate: invoiceLine.vatRate,
          grossAmount: invertDecimalString(invoiceLine.grossAmount),
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

    await issueInvoice(creditInvoiceId, new Date(), ctx.relation.id);

    return creditInvoiceId;
  }),
  delete: procedure
    .input(wrap(number()))
    .mutation(async ({ input }) =>
      db.delete(invoices).where(eq(invoices.id, input)),
    ),
});
