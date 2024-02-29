import dayjs from "dayjs";
import Decimal from "decimal.js";
import { eq } from "drizzle-orm";

import db from "@/db/client";
import { invoiceLines, invoices } from "@/db/schema";
import { generatePdf } from "@/utils/pdf";
import { TRPCError } from "@trpc/server";

import { getSettings } from "./setting";

export const getInvoice = async (invoiceId: number) => {
  const invoice = await db.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
    with: {
      lines: {
        columns: {
          id: true,
          name: true,
          unitAmount: true,
          quantity: true,
          netAmount: true,
          vatAmount: true,
          vatPercentage: true,
          grossAmount: true,
        },
      },
      events: {
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
        vatPercentage,
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
        vatPercentage,
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

export const calculateAmounts = (
  amount: string,
  quantity: string,
  vatPercentage: string,
) => {
  const netAmount = new Decimal(amount).mul(quantity);
  const vatAmount = netAmount.mul(vatPercentage).div(100);
  const grossAmount = netAmount.plus(vatAmount);

  // .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)

  return { netAmount, vatAmount, grossAmount };
};

export const roundDecimal = (decimal: number | string | Decimal) =>
  new Decimal(decimal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString();

type CreateInvoiceProps = {
  createdById: number;
  refType: "reservation" | "invoice";
  refId: number;
  type: "standard" | "quotation" | "credit" | "final";
  customerId: number;
  companyId: number;
  lines: {
    name: string;
    unitAmount: string;
    quantity: string;
    vatPercentage: string;
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
  const { netAmount, vatAmount, grossAmount, lineValues } = lines.reduce<{
    netAmount: Decimal;
    vatAmount: Decimal;
    grossAmount: Decimal;
    lineValues: {
      netAmount: Decimal;
      vatAmount: Decimal;
      grossAmount: Decimal;
    }[];
  }>(
    (acc, line) => {
      const { netAmount, vatAmount, grossAmount } = calculateAmounts(
        line.unitAmount,
        line.quantity,
        line.vatPercentage,
      );

      return {
        netAmount: acc.netAmount.plus(netAmount),
        vatAmount: acc.vatAmount.plus(vatAmount),
        grossAmount: acc.grossAmount.plus(grossAmount),
        lineValues: acc.lineValues.concat([
          { netAmount, vatAmount, grossAmount },
        ]),
      };
    },
    {
      netAmount: new Decimal(0),
      vatAmount: new Decimal(0),
      grossAmount: new Decimal(0),
      lineValues: [],
    },
  );

  const invoiceInsertResult = await db
    .insert(invoices)
    .values({
      // @ts-ignore ???
      createdById,
      refType,
      refId,
      type,
      status: "draft",
      netAmount,
      vatAmount,
      grossAmount,
      customerId,
      companyId,
      notes,
    })
    .returning({
      id: invoices.id,
    });

  const invoice = invoiceInsertResult[0];

  await db.insert(invoiceLines).values(
    lines.map(({ name, unitAmount, quantity, vatPercentage }, index) => {
      const { netAmount, vatAmount, grossAmount } = lineValues[index];

      return {
        invoiceId: invoice.id,
        name,
        unitAmount,
        quantity,
        netAmount: roundDecimal(netAmount),
        vatAmount: roundDecimal(vatAmount),
        vatPercentage,
        grossAmount: roundDecimal(grossAmount),
      };
    }),
  );

  return invoice.id;
};
