// TODO convert to valibot schema
export type Settings = {
  companyPaymentTerms: string;
  invoiceEmailTitle: string;
  invoiceEmailContent: string;
  invoiceHeaderImageSrc: string;
  invoiceFooterImageSrc: string;
  priceEntryMode: "net" | "gross";
  reservationRevenueAccountId: number;
};
