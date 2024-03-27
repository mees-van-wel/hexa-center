import dayjs from "dayjs";
import Decimal from "decimal.js";
import { and, desc, eq, or, sql } from "drizzle-orm";
import ejs from "ejs";

import { Settings } from "@/constants/settings";
import {
  businesses,
  customers,
  integrationConnections,
  integrationMappings,
  invoiceEvents,
  invoiceLines,
  invoices,
  logs,
  reservations,
} from "@/db/schema";
import { getCtx } from "@/utils/context";
import { readFile } from "@/utils/fileSystem";
import { generatePdf } from "@/utils/pdf";
import { sendSoapRequest } from "@/utils/soap";
import { TRPCError } from "@trpc/server";

import {
  getTwinfieldAccessToken,
  getTwinfieldWsdlUrl,
  TwinfieldIntegrationData,
} from "./integration";
import { getSetting, getSettings } from "./setting";

export const getInvoice = async (invoiceId: number) => {
  const { db } = getCtx();

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
          billingAddressLineOne: true,
          billingAddressLineTwo: true,
          billingCity: true,
          billingRegion: true,
          billingPostalCode: true,
          billingCountry: true,
          email: true,
          phone: true,
          contactPersonName: true,
          cocNumber: true,
          vatId: true,
        },
      },
      company: {
        columns: {
          name: true,
          email: true,
          phone: true,
          addressLineOne: true,
          addressLineTwo: true,
          city: true,
          region: true,
          postalCode: true,
          country: true,
          cocNumber: true,
          vatId: true,
          iban: true,
          swiftBic: true,
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
      customerBusinessContactPerson: true,
      customerBillingAddressLineOne: true,
      customerBillingAddressLineTwo: true,
      customerBillingPostalCode: true,
      customerBillingCity: true,
      customerBillingRegion: true,
      customerBillingCountry: true,
      customerEmail: true,
      customerPhone: true,
      customerCocNumber: true,
      customerVatId: true,

      companyId: true,
      companyName: true,
      companyAddressLineOne: true,
      companyAddressLineTwo: true,
      companyPostalCode: true,
      companyCity: true,
      companyRegion: true,
      companyCountry: true,
      companyEmail: true,
      companyPhone: true,
      companyVatId: true,
      companyCocNumber: true,
      companyIban: true,
      companySwiftBic: true,
    },
  });

  if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });

  return invoice;
};

export const generateInvoicePdf = async (invoiceId: number) => {
  const invoice = await getInvoice(invoiceId);

  const { invoiceHeaderImageSrc, invoiceFooterImageSrc } = await getSettings([
    "invoiceHeaderImageSrc",
    "invoiceFooterImageSrc",
  ]);

  const customerName = invoice.customerName || invoice.customer?.name;
  if (!customerName) {
    console.warn("Missing customerName");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing customerName",
    });
  }

  const customerBusinessContactPerson =
    invoice.customerBusinessContactPerson ||
    invoice.customer?.contactPersonName ||
    null;

  const customerBillingAddressLineOne =
    invoice.customerBillingAddressLineOne ||
    invoice.customer?.billingAddressLineOne;
  if (!customerBillingAddressLineOne) {
    console.warn("Missing customerBillingAddressLineOne");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing customerBillingAddressLineOne",
    });
  }

  const customerBillingAddressLineTwo =
    invoice.customerBillingAddressLineTwo ||
    invoice.customer?.billingAddressLineTwo ||
    null;

  const customerBillingCity =
    invoice.customerBillingCity || invoice.customer?.billingCity;
  if (!customerBillingCity) {
    console.warn("Missing customerBillingCity");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing customerBillingCity",
    });
  }

  const customerBillingRegion =
    invoice.customerBillingRegion || invoice.customer?.billingRegion || null;

  const customerBillingPostalCode =
    invoice.customerBillingPostalCode ||
    invoice.customer?.billingPostalCode ||
    null;

  const customerBillingCountry =
    invoice.customerBillingCountry || invoice.customer?.billingCountry;
  if (!customerBillingCountry) {
    console.warn("Missing customerBillingCountry");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing customerBillingCountry",
    });
  }

  const customerEmail =
    invoice.customerEmail || invoice.customer?.email || null;

  const customerPhone =
    invoice.customerPhone || invoice.customer?.phone || null;

  const customerCocNumber =
    invoice.customerCocNumber || invoice.customer?.cocNumber || null;

  const customerVatId =
    invoice.customerVatId || invoice.customer?.vatId || null;

  const companyName = invoice.companyName || invoice.company?.name;
  if (!companyName) {
    console.warn("Missing companyName");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companyName",
    });
  }

  const companyAddressLineOne =
    invoice.companyAddressLineOne || invoice.company?.addressLineOne;
  if (!companyAddressLineOne) {
    console.warn("Missing companyAddressLineOne");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companyAddressLineOne",
    });
  }

  const companyAddressLineTwo =
    invoice.companyAddressLineTwo || invoice.company?.addressLineTwo || null;

  const companyCity = invoice.companyCity || invoice.company?.city;
  if (!companyCity) {
    console.warn("Missing companyCity");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companyCity",
    });
  }

  const companyRegion =
    invoice.companyRegion || invoice.company?.region || null;

  const companyPostalCode =
    invoice.companyPostalCode || invoice.company?.postalCode || null;

  const companyCountry = invoice.companyCountry || invoice.company?.country;
  if (!companyCountry) {
    console.warn("Missing companyCountry");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companyCountry",
    });
  }

  const companyEmail = invoice.companyEmail || invoice.company?.email;
  if (!companyEmail) {
    console.warn("Missing companyEmail");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companyEmail",
    });
  }

  const companyPhone = invoice.companyPhone || invoice.company?.phone;
  if (!companyPhone) {
    console.warn("Missing companyPhone");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companyPhone",
    });
  }

  const companyCocNumber =
    invoice.companyCocNumber || invoice.company?.cocNumber;
  if (!companyCocNumber) {
    console.warn("Missing companyCocNumber");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companyCocNumber",
    });
  }

  const companyVatId = invoice.companyVatId || invoice.company?.vatId;
  if (!companyVatId) {
    console.warn("Missing companyVatId");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companyVatId",
    });
  }

  const companyIban = invoice.companyIban || invoice.company?.iban;
  if (!companyIban) {
    console.warn("Missing companyIban");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companyIban",
    });
  }

  const companySwiftBic = invoice.companySwiftBic || invoice.company?.swiftBic;
  if (!companySwiftBic) {
    console.warn("Missing companySwiftBic");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing companySwiftBic",
    });
  }

  const pdfBuffer = await generatePdf("invoice", {
    headerImageSrc: invoiceHeaderImageSrc,
    footerImageSrc: invoiceFooterImageSrc,
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
    customerName,
    customerBusinessContactPerson,
    customerBillingAddressLineOne,
    customerBillingAddressLineTwo,
    customerBillingCity,
    customerBillingRegion,
    customerBillingPostalCode,
    customerBillingCountry,
    customerEmail,
    customerPhone,
    customerCocNumber,
    customerVatId,
    companyName,
    companyAddressLineOne,
    companyAddressLineTwo,
    companyCity,
    companyRegion,
    companyPostalCode,
    companyCountry,
    companyEmail,
    companyPhone,
    companyCocNumber,
    companyVatId,
    companyIban,
    companySwiftBic,
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

export const roundDecimal = (decimal: number | string | Decimal) =>
  new Decimal(decimal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

export const calculateInvoiceAmounts = (
  lines: {
    unitAmount: Decimal | number | string;
    quantity: Decimal | number | string;
    vatRate: Decimal | number | string | null;
  }[],
  priceEntryMode: Settings["priceEntryMode"],
) => {
  let totalNetAmount = new Decimal(0);
  let totalVatAmount = new Decimal(0);
  let totalGrossAmount = new Decimal(0);

  const calculatedLines = lines.map((line) => {
    let unitAmount = new Decimal(line.unitAmount);
    const quantity = new Decimal(line.quantity);
    const vatRate = new Decimal(line.vatRate || 0).div(100);

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
  customerBusinessContactPerson?: string | null;
  lines: {
    revenueAccountId: number;
    name: string;
    unitAmount: string;
    quantity: string;
    vatRate: string | null;
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
  customerBusinessContactPerson,
  lines,
  notes,
}: CreateInvoiceProps) => {
  const { db } = getCtx();

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
      customerBusinessContactPerson,
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
    lines.map(({ revenueAccountId, name, quantity, vatRate }, index) => {
      const { unitAmount, netAmount, vatAmount, grossAmount } =
        calculatedLines[index];

      return {
        invoiceId: invoice.id,
        revenueAccountId,
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
  userId: number,
) => {
  const { db } = getCtx();

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
    customerResult,
    businessesResult,
    companyPaymentTerms,
    countResult,
    highestNumber,
  ] = await Promise.all([
    db.select().from(customers).where(eq(customers.id, invoice.customerId)),
    db.select().from(businesses).where(eq(businesses.id, invoice.companyId)),
    getSetting("companyPaymentTerms"),
    db
      .select({
        count: sql<number>`CAST(COUNT(*) AS INT)`,
      })
      .from(invoices)
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${invoices.date}) = ${date.getFullYear()}`,
          or(eq(invoices.type, "standard"), eq(invoices.type, "credit")),
        ),
      ),
    db
      .select({
        number: invoices.number,
      })
      .from(invoices)
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${invoices.date}) = ${date.getFullYear()}`,
          or(eq(invoices.type, "standard"), eq(invoices.type, "credit")),
        ),
      )
      .orderBy(desc(invoices.number))
      .limit(1),
  ]);

  const customer = customerResult[0];
  if (!customer)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `customer ${invoice.customerId} not found`,
    });

  const company = businessesResult[0];
  if (!company)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `company ${invoice.companyId} not found`,
    });

  const { count } = countResult[0];

  const dueDate = dayjs(date).add(dayjs.duration(companyPaymentTerms));

  let invoiceNumber: string = (count + 1).toString().padStart(4, "0");
  const highestInvoiceNumber = highestNumber[0]?.number?.split("-")[0].slice(4);

  if (
    highestInvoiceNumber &&
    highestInvoiceNumber.localeCompare(invoiceNumber, undefined, {
      numeric: true,
    }) > 0
  ) {
    invoiceNumber = (parseInt(highestInvoiceNumber) + 1)
      .toString()
      .padStart(4, "0");
  }

  invoiceNumber = date.getFullYear() + invoiceNumber;

  // TODO only update when empty (customer/company)
  await db
    .update(invoices)
    .set({
      status: "issued",
      date,
      dueDate:
        invoice.type !== "credit" && invoice.type !== "quotation"
          ? dueDate.toDate()
          : undefined,
      number: invoice.number || invoiceNumber,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerBillingAddressLineOne: customer.billingAddressLineOne,
      customerBillingAddressLineTwo: customer.billingAddressLineTwo,
      customerBillingCity: customer.billingCity,
      customerBillingRegion: customer.billingRegion,
      customerBillingPostalCode: customer.billingPostalCode,
      customerBillingCountry: customer.billingCountry,
      customerBusinessContactPerson:
        invoice.customerBusinessContactPerson || customer.contactPersonName,
      customerVatId: customer?.vatId,
      companyName: company.name,
      companyEmail: company.email,
      companyPhone: company.phone,
      companyAddressLineOne: company.addressLineOne,
      companyAddressLineTwo: company.addressLineTwo,
      companyCity: company.city,
      companyRegion: company.region,
      companyPostalCode: company.postalCode,
      companyCountry: company.country,
      companyCocNumber: company.cocNumber,
      companyVatId: company.vatId,
      companyIban: company.iban,
      companySwiftBic: company.swiftBic,
    })
    .where(eq(invoices.id, invoiceId));

  await db.insert(invoiceEvents).values({
    createdById: userId,
    invoiceId,
    type: "issued",
  });

  const integrationResult = await db
    .select()
    .from(integrationConnections)
    .where(eq(integrationConnections.type, "twinfield"));

  const integration = integrationResult[0] as (typeof integrationResult)[0] & {
    data: TwinfieldIntegrationData;
  };

  if (integration) {
    const { id, accessToken, companyCode } = await getTwinfieldAccessToken();
    const wsdlUrl = await getTwinfieldWsdlUrl(accessToken);

    const customerMappingResult = await db
      .select()
      .from(integrationMappings)
      .where(
        and(
          eq(integrationMappings.refType, "customer"),
          eq(integrationMappings.refId, customer.id),
        ),
      );

    // @ts-ignore
    const externalCustomerCode = customerMappingResult[0]?.data?.code;

    if (!externalCustomerCode) {
      console.warn(`Missing integration mapping for user: ${customer.id}`);
      return;
    }

    const lines = await db
      .select()
      .from(invoiceLines)
      .where(eq(invoiceLines.invoiceId, invoice.id));

    const formattedLines: {
      revenueAccountCode: string;
      netAmount: string;
      name: string;
      vatCode: string | null;
      vatAmount: string;
    }[] = [];

    // TODO store in db
    const VatRateToVatCodeMap = {
      "21.00": "VH",
      "9.00": "VL",
      "0.00": "VN",
    } as const;

    for (const line of lines) {
      const revenueAccountMappingResult = await db
        .select()
        .from(integrationMappings)
        .where(
          and(
            eq(integrationMappings.refType, "ledgerAccount"),
            eq(integrationMappings.refId, line.revenueAccountId),
          ),
        );

      // @ts-ignore
      const revenueAccountCode = revenueAccountMappingResult[0]?.data?.code;

      if (!revenueAccountCode) {
        console.warn(
          `Missing integration mapping for ledger account: ${line.revenueAccountId}`,
        );
        return;
      }

      formattedLines.push({
        revenueAccountCode,
        netAmount: line.netAmount,
        name: line.name,
        vatCode: !line.vatRate?.toString()
          ? null
          : line.vatRate in VatRateToVatCodeMap
            ? VatRateToVatCodeMap[
                line.vatRate as keyof typeof VatRateToVatCodeMap
              ]
            : VatRateToVatCodeMap["0.00"],
        vatAmount: line.vatAmount,
      });
    }

    const balanceAccountMappingResult = await db
      .select()
      .from(integrationMappings)
      .where(
        and(
          eq(integrationMappings.refType, "ledgerAccount"),
          eq(
            integrationMappings.refId,
            integration.data.transactionBalanceAccountId,
          ),
        ),
      );

    const externalBalanceAccountCode =
      // @ts-ignore
      balanceAccountMappingResult[0]?.data?.code;

    if (!externalBalanceAccountCode) {
      console.warn(
        `Missing integration mapping for ledger account: ${integration.data.transactionBalanceAccountId}`,
      );
      return;
    }

    const transactionTypeMappingResult = await db
      .select()
      .from(integrationMappings)
      .where(
        and(
          eq(integrationMappings.refType, "journal"),
          eq(integrationMappings.refId, integration.data.transactionJournalId),
        ),
      );

    const externalTransactionTypeCode =
      // @ts-ignore
      transactionTypeMappingResult[0]?.data?.code;

    if (!externalTransactionTypeCode) {
      console.warn(
        `Missing integration mapping for journal: ${integration.data.transactionJournalId}`,
      );
      return;
    }

    let xml = await readFile(
      "soapEnvelope",
      "createTwinfieldTransaction.xml.ejs",
    );

    xml = await ejs.render(
      xml,
      {
        accessToken,
        companyCode,
        // TODO Make variable
        currency: "EUR",
        transactionTypeCode: externalTransactionTypeCode,
        date: dayjs(date).format("YYYYMMDD"),
        invoiceNumber,
        dueDate: dueDate.format("YYYYMMDD"),
        balanceAccountCode: externalBalanceAccountCode,
        customerCode: externalCustomerCode,
        totalAmount: invoice.grossAmount,
        lines: formattedLines,
      },
      { async: true },
    );

    try {
      const createTransactionResponse = await sendSoapRequest({
        url: wsdlUrl,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: "http://www.twinfield.com/ProcessXmlDocument",
        },
        xml,
      });

      await db.insert(logs).values({
        type: "info",
        event: "integrationSend",
        refType: "integration",
        refId: id,
      });

      if (invoice.refType === "reservation") {
        const reservationResult = await db
          .select({
            startDate: reservations.startDate,
            endDate: reservations.endDate,
          })
          .from(reservations)
          .where(eq(reservations.id, invoice.refId));

        const reservation = reservationResult[0];

        if (!reservation) {
          console.warn(`Reservation not found: ${invoice.refId}`);
          return;
        }

        const balanceAccountMappingResult = await db
          .select()
          .from(integrationMappings)
          .where(
            and(
              eq(integrationMappings.refType, "ledgerAccount"),
              eq(
                integrationMappings.refId,
                integration.data.spreadBalanceAccountId,
              ),
            ),
          );

        const externalBalanceAccountCode =
          // @ts-ignore
          balanceAccountMappingResult[0]?.data?.code;

        if (!externalBalanceAccountCode) {
          console.warn(
            `Missing integration mapping for ledger account: ${integration.data.spreadBalanceAccountId}`,
          );
          return;
        }

        const transactionTypeMappingResult = await db
          .select()
          .from(integrationMappings)
          .where(
            and(
              eq(integrationMappings.refType, "journal"),
              eq(integrationMappings.refId, integration.data.spreadJournalId),
            ),
          );

        const externalTransactionTypeCode =
          // @ts-ignore
          transactionTypeMappingResult[0]?.data?.code;

        if (!externalTransactionTypeCode) {
          console.warn(
            `Missing integration mapping for journal: ${integration.data.spreadJournalId}`,
          );
          return;
        }

        const transactionNumber =
          createTransactionResponse.ProcessXmlDocumentResponse
            .ProcessXmlDocumentResult.transaction.header.number;

        let xml = await readFile(
          "soapEnvelope",
          "spreadTwinfieldTransaction.xml.ejs",
        );

        xml = await ejs.render(
          xml,
          {
            accessToken,
            companyCode,
            transactionTypeCode: externalTransactionTypeCode,
            transactionNumber,
            balanceAccountCode: externalBalanceAccountCode,
            startPeriod: dayjs(reservation.startDate).format("YYYY/MM"),
            endPeriod: dayjs(reservation.endDate).format("YYYY/MM"),
          },
          { async: true },
        );

        try {
          await sendSoapRequest({
            url: wsdlUrl,
            headers: {
              "Content-Type": "text/xml; charset=utf-8",
              SOAPAction: "http://www.twinfield.com/ProcessXmlDocument",
            },
            xml,
          });

          await db.insert(logs).values({
            type: "info",
            event: "integrationSend",
            refType: "integration",
            refId: id,
          });
        } catch (error) {
          console.warn(error);
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }
};
