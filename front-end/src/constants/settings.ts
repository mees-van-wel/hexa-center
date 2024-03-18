// TODO convert to valibot schema
// TODO Typed keys
export type Settings = {
  companyPaymentTerms: string;
  companyLogoSrc: string;
  invoiceEmailTitle: string;
  invoiceEmailContent: string;
  invoiceHeaderImageSrc: string;
  invoiceFooterImageSrc: string;
  priceEntryMode: "net" | "gross";
  reservationRevenueAccountId: number;
};
