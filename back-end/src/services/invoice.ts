import dayjs from "dayjs";
import Decimal from "decimal.js";
import { and, eq, sql } from "drizzle-orm";

import db from "@/db/client";
import {
  invoiceEvents,
  invoiceLines,
  invoices,
  properties,
  relations,
} from "@/db/schema";
import { generatePdf } from "@/utils/pdf";
import { Settings } from "@front-end/constants/settings";
import { TRPCError } from "@trpc/server";

import { getSetting, getSettings } from "./setting";

export const getInvoice = async (invoiceId: number) => {
  const invoice = await db.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
    with: {
      createdBy: true,
      lines: {
        columns: {
          id: true,
          name: true,
          unitAmount: true,
          quantity: true,
          netAmount: true,
          vatAmount: true,
          vatRate: true,
          grossAmount: true,
        },
      },
      events: {
        with: {
          createdBy: true,
        },
        columns: {
          id: true,
          createdAt: true,
          createdById: true,
          type: true,
          refType: true,
          refId: true,
        },
      },
      customer: {
        columns: {
          name: true,
          street: true,
          houseNumber: true,
          postalCode: true,
          city: true,
          region: true,
          country: true,
          emailAddress: true,
          phoneNumber: true,
          cocNumber: true,
          vatNumber: true,
        },
      },
      company: {
        columns: {
          name: true,
          street: true,
          houseNumber: true,
          postalCode: true,
          city: true,
          region: true,
          country: true,
          emailAddress: true,
          phoneNumber: true,
        },
      },
    },
    columns: {
      $kind: true,
      id: true,
      createdAt: true,
      createdById: true,
      refType: true,
      refId: true,
      number: true,
      notes: true,
      type: true,
      date: true,
      dueDate: true,
      status: true,
      netAmount: true,
      vatAmount: true,
      grossAmount: true,

      customerId: true,
      customerName: true,
      customerStreet: true,
      customerHouseNumber: true,
      customerPostalCode: true,
      customerCity: true,
      customerRegion: true,
      customerCountry: true,
      customerEmailAddress: true,
      customerPhoneNumber: true,
      customerVatNumber: true,
      customerCocNumber: true,

      companyId: true,
      companyName: true,
      companyStreet: true,
      companyHouseNumber: true,
      companyPostalCode: true,
      companyCity: true,
      companyRegion: true,
      companyCountry: true,
      companyEmailAddress: true,
      companyPhoneNumber: true,
      companyVatNumber: true,
      companyCocNumber: true,
      companyIban: true,
      companySwiftBic: true,
    },
  });

  if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });

  const {
    companyPaymentTerms,
    companyVatNumber,
    companyCocNumber,
    companyIban,
    companySwiftBic,
    invoiceHeaderImageSrc,
    invoiceFooterImageSrc,
  } = await getSettings([
    "companyPaymentTerms",
    "companyVatNumber",
    "companyCocNumber",
    "companyIban",
    "companySwiftBic",
    "invoiceHeaderImageSrc",
    "invoiceFooterImageSrc",
  ]);

  return {
    ...invoice,
    company: invoice.company
      ? {
          ...invoice.company,
          paymentTerms: companyPaymentTerms,
          vatNumber: companyVatNumber,
          cocNumber: companyCocNumber,
          iban: companyIban,
          swiftBic: companySwiftBic,
        }
      : null,
    headerImageSrc:
      typeof invoiceHeaderImageSrc === "string" ? invoiceHeaderImageSrc : null,
    footerImageSrc:
      typeof invoiceFooterImageSrc === "string" ? invoiceFooterImageSrc : null,
  };
};

export const generateInvoicePdf = async (invoiceId: number) => {
  const invoice = await getInvoice(invoiceId);

  const pdfBuffer = await generatePdf("invoice", {
    headerImageSrc: invoice.headerImageSrc,
    footerImageSrc: invoice.footerImageSrc,
    type:
      invoice.type === "quotation"
        ? "Quotation"
        : invoice.type === "credit"
          ? "Credit invoice"
          : "Invoice",
    number: invoice.number || invoice.id.toString(),
    date: invoice.date
      ? dayjs(invoice.date).format("DD-MM-YYYY")
      : dayjs(invoice.createdAt).format("DD-MM-YYYY"),
    customerName: invoice.customerName || invoice.customer?.name || "",
    customerStreet: invoice.customerStreet || invoice.customer?.street || "",
    customerHouseNumber:
      invoice.customerHouseNumber || invoice.customer?.houseNumber || "",
    customerPostalCode:
      invoice.customerPostalCode || invoice.customer?.postalCode || "",
    customerCity: invoice.customerCity || invoice.customer?.city || "",
    customerCountry: invoice.customerCountry || invoice.customer?.country || "",
    customerEmailAddress:
      invoice.customerEmailAddress || invoice.customer?.emailAddress || "",
    customerPhoneNumber:
      invoice.customerPhoneNumber || invoice.customer?.phoneNumber || "",
    customerCocNumber:
      invoice.customerCocNumber || invoice.customer?.cocNumber || null,
    customerVatNumber:
      invoice.customerVatNumber || invoice.customer?.vatNumber || null,
    companyName: invoice.companyName || invoice.company?.name || "",
    companyStreet: invoice.companyStreet || invoice.company?.street || "",
    companyHouseNumber:
      invoice.companyHouseNumber || invoice.company?.houseNumber || "",
    companyPostalCode:
      invoice.companyPostalCode || invoice.company?.postalCode || "",
    companyCity: invoice.companyCity || invoice.company?.city || "",
    companyCountry: invoice.companyCountry || invoice.company?.country || "",
    companyEmailAddress:
      invoice.companyEmailAddress || invoice.company?.emailAddress || "",
    companyPhoneNumber:
      invoice.companyPhoneNumber || invoice.company?.phoneNumber || "",
    companyCocNumber:
      invoice.companyCocNumber || invoice.company?.cocNumber || "",
    companyVatNumber:
      invoice.companyVatNumber || invoice.company?.vatNumber || "",
    companyIban: invoice.companyIban || invoice.company?.iban || "",
    companySwiftBic: invoice.companySwiftBic || invoice.company?.swiftBic || "",
    lines: invoice.lines.map(
      ({
        name,
        unitAmount,
        quantity,
        netAmount,
        vatAmount,
        vatRate,
        grossAmount,
      }) => ({
        name,
        unitAmount: Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(unitAmount)),
        quantity,
        netAmount: Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(netAmount)),
        vatAmount: Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(vatAmount)),
        vatRate,
        grossAmount: Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(grossAmount)),
      }),
    ),
    netAmount: Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(invoice.netAmount)),
    vatAmount: Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(invoice.vatAmount)),
    grossAmount: Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(invoice.grossAmount)),
    notes: invoice.notes,
    dueDate: invoice.dueDate
      ? dayjs(invoice.dueDate).format("DD-MM-YYYY")
      : null,
  });

  return {
    base64: pdfBuffer.toString("base64"),
    invoice,
  };
};

export const invertDecimalString = (decimalString: string) =>
  (-parseFloat(decimalString)).toString();

export const calculateVatFromNetAmount = (
  netAmount: Decimal | number | string,
  vatRate: Decimal | number | string,
) => {
  const net = new Decimal(netAmount);
  const rate = new Decimal(vatRate).div(100);
  return net.mul(rate);
};

export const extractVatFromGrossAmount = (
  grossAmount: Decimal | number | string,
  vatRate: Decimal | number | string,
) => {
  const gross = new Decimal(grossAmount);
  const rate = new Decimal(vatRate).div(100);
  return gross.sub(gross.div(rate.add(1)));
};

export const roundDecimal = (decimal: number | string | Decimal) =>
  new Decimal(decimal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

export const calculateInvoiceAmounts = (
  lines: {
    unitAmount: Decimal | number | string;
    quantity: Decimal | number | string;
    vatRate: Decimal | number | string;
  }[],
  priceEntryMode: Settings["priceEntryMode"],
) => {
  let totalNetAmount = new Decimal(0);
  let totalVatAmount = new Decimal(0);
  let totalGrossAmount = new Decimal(0);

  const calculatedLines = lines.map((line) => {
    let unitAmount = new Decimal(line.unitAmount);
    const quantity = new Decimal(line.quantity);
    const vatRate = new Decimal(line.vatRate).div(100);

    let netAmount: Decimal;
    let vatAmount: Decimal;
    let grossAmount: Decimal;

    if (priceEntryMode === "gross") {
      grossAmount = roundDecimal(unitAmount.mul(quantity));
      vatAmount = roundDecimal(
        grossAmount.sub(grossAmount.div(vatRate.add(1))),
      );
      netAmount = roundDecimal(grossAmount.sub(vatAmount));
      unitAmount = roundDecimal(netAmount.div(quantity));
    } else {
      netAmount = roundDecimal(unitAmount.mul(quantity));
      vatAmount = roundDecimal(netAmount.mul(vatRate));
      grossAmount = roundDecimal(netAmount.add(vatAmount));
    }

    unitAmount = roundDecimal(unitAmount);
    netAmount = roundDecimal(netAmount);
    vatAmount = roundDecimal(vatAmount);
    grossAmount = roundDecimal(grossAmount);

    totalNetAmount = totalNetAmount.add(netAmount);
    totalVatAmount = totalVatAmount.add(vatAmount);
    totalGrossAmount = totalGrossAmount.add(grossAmount);

    return { unitAmount, netAmount, vatAmount, grossAmount };
  });

  totalNetAmount = roundDecimal(totalNetAmount);
  totalVatAmount = roundDecimal(totalVatAmount);
  totalGrossAmount = roundDecimal(totalGrossAmount);

  return { totalNetAmount, totalVatAmount, totalGrossAmount, calculatedLines };
};

type CreateInvoiceProps = {
  createdById: number;
  refType: "reservation" | "invoice";
  refId: number;
  type: "standard" | "quotation" | "credit";
  customerId: number;
  companyId: number;
  lines: {
    name: string;
    unitAmount: string;
    quantity: string;
    vatRate: string;
  }[];
  notes?: string | null;
};

export const createInvoice = async ({
  createdById,
  refType,
  refId,
  type,
  customerId,
  companyId,
  lines,
  notes,
}: CreateInvoiceProps) => {
  const priceEntryMode = await getSetting("priceEntryMode");

  const { totalNetAmount, totalVatAmount, totalGrossAmount, calculatedLines } =
    calculateInvoiceAmounts(lines, priceEntryMode);

  const invoiceInsertResult = await db
    .insert(invoices)
    .values({
      createdById,
      refType,
      refId,
      type,
      status: "draft",
      netAmount: roundDecimal(totalNetAmount).toString(),
      vatAmount: roundDecimal(totalVatAmount).toString(),
      grossAmount: roundDecimal(totalGrossAmount).toString(),
      customerId,
      companyId,
      notes,
    })
    .returning({
      id: invoices.id,
    });

  const invoice = invoiceInsertResult[0];

  await db.insert(invoiceLines).values(
    lines.map(({ name, quantity, vatRate }, index) => {
      const { unitAmount, netAmount, vatAmount, grossAmount } =
        calculatedLines[index];

      return {
        invoiceId: invoice.id,
        name,
        unitAmount: roundDecimal(unitAmount).toString(),
        quantity,
        netAmount: roundDecimal(netAmount).toString(),
        vatAmount: roundDecimal(vatAmount).toString(),
        vatRate,
        grossAmount: roundDecimal(grossAmount).toString(),
      };
    }),
  );

  return invoice.id;
};

export const issueInvoice = async (
  invoiceId: number,
  date: Date,
  relationId: number,
) => {
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
    db.select().from(properties).where(eq(properties.id, invoice.companyId)),
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
          eq(invoices.type, "standard"),
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
    createdById: relationId,
    invoiceId,
    type: "issued",
  });
};
