// TODO convert to valibot schema
// TODO Typed keys
export type Settings = {
  companyPaymentTerms: string;
  companyLogoSrc: string | null;
  invoiceEmailTitle: string;
  invoiceEmailContent: string;
  invoiceHeaderImageSrc: string | null;
  invoiceFooterImageSrc: string | null;
  priceEntryMode: "net" | "gross";
  reservationRevenueAccountId: number;
};
