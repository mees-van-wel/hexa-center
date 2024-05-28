import { TRPCError } from "@trpc/server";
import { wrap } from "@typeschema/valibot";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import { and, desc, eq } from "drizzle-orm";
import { date, number, object } from "valibot";

import {
  invoiceEvents,
  invoiceLines,
  invoices,
  reservationsToInvoices,
} from "~/db/schema";
import {
  generateInvoicePdf,
  getInvoice,
  invertDecimalString,
  issueInvoice,
} from "~/services/invoice";
import { getSettings } from "~/services/setting";
import { procedure, router } from "~/trpc";
import { sendMail } from "~/utils/mail";

dayjs.extend(duration);

export const invoiceRouter = router({
  list: procedure.query(({ ctx }) =>
    ctx.db.query.invoices.findMany({
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
        netAmount: true,
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
      await issueInvoice(invoiceId, date, ctx.user.id);
      return await getInvoice(invoiceId);
    }),
  generatePdf: procedure
    .input(wrap(number()))
    .mutation(async ({ input }) => (await generateInvoicePdf(input)).base64),
  mail: procedure.input(wrap(number())).mutation(async ({ input, ctx }) => {
    const { invoice, base64 } = await generateInvoicePdf(input);

    const { companyLogoSrc, invoiceEmailTitle, invoiceEmailContent } =
      await getSettings([
        "companyLogoSrc",
        "invoiceEmailTitle",
        "invoiceEmailContent",
      ]);

    if (!invoiceEmailTitle || !invoiceEmailContent)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing invoice email settings",
      });

    const customerName = invoice.customerName || invoice.customer?.name;
    if (!customerName)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing customer name",
      });

    const customerEmail = invoice.customerEmail || invoice.customer?.email;
    if (!customerEmail)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing customer email",
      });

    const companyName = invoice.companyName || invoice.company?.name;
    if (!customerEmail)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing company name",
      });

    await sendMail({
      logo: companyLogoSrc || undefined,
      title: invoiceEmailTitle,
      from: {
        name: companyName,
      },
      replyToEmail: invoice.companyEmail || invoice.company?.email || undefined,
      to: {
        name: customerName,
        email: customerEmail,
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

    await ctx.db.insert(invoiceEvents).values({
      createdById: ctx.user.id,
      invoiceId: input,
      type: "mailed",
    });

    return await getInvoice(input);
  }),
  credit: procedure.input(wrap(number())).mutation(async ({ input, ctx }) => {
    const invoicesResult = await ctx.db
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
        ctx.db
          .insert(invoices)
          .values({
            createdById: ctx.user.id,
            refType: invoice.refType,
            refId: invoice.refId,
            type: "credit",
            status: "draft",
            netAmount: invertDecimalString(invoice.netAmount),
            vatAmount: invertDecimalString(invoice.vatAmount),
            grossAmount: invertDecimalString(invoice.grossAmount),
            notes: invoice.notes,
            customerId: invoice.customerId,
            companyId: invoice.companyId,
          })
          .returning({ id: invoices.id }),
        ctx.db
          .select({
            revenueAccountId: invoiceLines.revenueAccountId,
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
        ctx.db
          .update(invoices)
          .set({
            status: "credited",
          })
          .where(eq(invoices.id, input)),
      ],
    );

    const creditInvoiceId = createCreditInvoiceResponse[0].id;

    await Promise.all([
      ctx.db.insert(invoiceLines).values(
        invoiceLinesResult.map((invoiceLine) => ({
          invoiceId: creditInvoiceId,
          revenueAccountId: invoiceLine.revenueAccountId,
          name: invoiceLine.name,
          unitAmount: invertDecimalString(invoiceLine.unitAmount),
          quantity: invoiceLine.quantity,
          netAmount: invertDecimalString(invoiceLine.netAmount),
          vatAmount: invertDecimalString(invoiceLine.vatAmount),
          vatRate: invoiceLine.vatRate,
          grossAmount: invertDecimalString(invoiceLine.grossAmount),
        })),
      ),
      ctx.db.insert(invoiceEvents).values({
        invoiceId: input,
        type: "credited",
        createdById: ctx.user.id,
        refType: "invoice",
        refId: creditInvoiceId,
      }),
    ]);

    if (invoice.refType === "reservation") {
      const reservationsToInvoicesResult = await ctx.db
        .select()
        .from(reservationsToInvoices)
        .where(
          and(
            eq(reservationsToInvoices.invoiceId, input),
            eq(reservationsToInvoices.reservationId, invoice.refId),
          ),
        );

      const reservationsToInvoice = reservationsToInvoicesResult[0];

      await ctx.db.insert(reservationsToInvoices).values({
        ...reservationsToInvoice,
        invoiceId: creditInvoiceId,
      });
    }

    await issueInvoice(creditInvoiceId, new Date(), ctx.user.id);

    return creditInvoiceId;
  }),
  delete: procedure
    .input(wrap(number()))
    .mutation(async ({ input, ctx }) =>
      ctx.db.delete(invoices).where(eq(invoices.id, input)),
    ),
});
