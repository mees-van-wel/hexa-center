import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import { eq, sql } from "drizzle-orm";
import { date, number, object } from "valibot";

import db from "@/db/client";
import { invoiceEvents, invoices, properties, relations } from "@/db/schema";
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
        totalGrossAmount: true,
      },
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
            sql`EXTRACT(YEAR FROM ${invoices.date}) = ${date.getFullYear()}`,
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

      await db
        .update(invoices)
        .set({
          status: "issued",
          date,
          dueDate:
            invoice.type !== "credit" && invoice.type !== "quotation"
              ? dayjs(date).add(dayjs.duration(companyPaymentTerms)).toDate()
              : undefined,
          number: date.getFullYear() + (count + 1).toString().padStart(4, "0"),
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
});
