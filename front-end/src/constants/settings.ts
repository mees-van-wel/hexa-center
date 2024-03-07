// TODO convert to valibot schema
export type Settings = {
  companyPaymentTerms: string;
  companyVatNumber: string;
  companyCocNumber: string;
  companyIban: string;
  companySwiftBic: string;
  invoiceEmailTitle: string;
  invoiceEmailContent: string;
  invoiceHeaderImageSrc: string;
  invoiceFooterImageSrc: string;
  priceEntryMode: "net" | "gross";
};
