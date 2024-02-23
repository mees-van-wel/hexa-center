import dayjs from "dayjs";
import { eq } from "drizzle-orm";

import db from "@/db/client";
import { invoices } from "@/db/schema";
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
          comments: true,
          unitNetAmount: true,
          quantity: true,
          discountAmount: true,
          totalNetAmount: true,
          totalTaxAmount: true,
          taxPercentage: true,
          totalGrossAmount: true,
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
      comments: true,
      type: true,
      date: true,
      dueDate: true,
      status: true,
      discountAmount: true,
      totalNetAmount: true,
      totalTaxAmount: true,
      totalGrossAmount: true,
      totalDiscountAmount: true,

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
    hasComments: invoice.lines.some(({ comments }) => comments),
    totalDiscountAmount: invoice.totalDiscountAmount
      ? Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(invoice.totalDiscountAmount))
      : null,
    lines: invoice.lines.map(
      ({
        name,
        comments,
        unitNetAmount,
        quantity,
        totalNetAmount,
        discountAmount,
        totalTaxAmount,
        taxPercentage,
        totalGrossAmount,
      }) => ({
        name,
        comments,
        unitNetAmount: Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(unitNetAmount)),
        quantity,
        totalNetAmount: Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(totalNetAmount)),
        discountAmount: discountAmount
          ? Intl.NumberFormat("nl-NL", {
              style: "currency",
              currency: "EUR",
            }).format(parseFloat(discountAmount))
          : null,
        totalTaxAmount: Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(totalTaxAmount)),
        taxPercentage,
        totalGrossAmount: Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(parseFloat(totalGrossAmount)),
      }),
    ),
    totalNetAmount: Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(invoice.totalNetAmount)),
    totalTaxAmount: Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(invoice.totalTaxAmount)),
    totalGrossAmount: Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(invoice.totalGrossAmount)),
    comments: invoice.comments,
    dueDate: invoice.dueDate
      ? dayjs(invoice.dueDate).format("DD-MM-YYYY")
      : null,
  });

  return {
    base64: pdfBuffer.toString("base64"),
    invoice,
  };
};
