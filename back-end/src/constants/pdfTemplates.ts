export const PDF_TEMPLATES = {
  INVOICE: "invoice",
} as const;

export type PDFTemplates = typeof PDF_TEMPLATES;
export type PDFTemplateKeys = keyof PDFTemplates;
export type PDFTemplate = PDFTemplates[PDFTemplateKeys];

export const PDF_TEMPLATE_KEYS = Object.keys(
  PDF_TEMPLATES,
) as PDFTemplateKeys[];

export const PDF_TEMPLATE_VALUES = Object.values(
  PDF_TEMPLATES,
) as PDFTemplate[];

export type PDFTemplateVariables = {
  [PDF_TEMPLATES.INVOICE]: {
    headerImageSrc: string | null;
    footerImageSrc: string | null;
    type: string;
    number: string;
    date: string;
    customerName: string;
    customerBusinessContactPerson: string | null;
    customerBillingAddressLineOne: string;
    customerBillingAddressLineTwo: string | null;
    customerBillingCity: string;
    customerBillingRegion: string | null;
    customerBillingPostalCode: string | null;
    customerBillingCountry: string;
    customerEmail: string | null;
    customerPhone: string | null;
    customerCocNumber: string | null;
    customerVatId: string | null;
    companyName: string;
    companyAddressLineOne: string;
    companyAddressLineTwo: string | null;
    companyCity: string;
    companyRegion: string | null;
    companyPostalCode: string | null;
    companyCountry: string;
    companyEmail: string;
    companyPhone: string;
    companyCocNumber: string;
    companyVatId: string;
    companyIban: string;
    companySwiftBic: string;
    lines: {
      name: string;
      unitAmount: string;
      quantity: string;
      netAmount: string;
      vatAmount: string;
      vatRate: string | null;
      grossAmount: string;
    }[];
    netAmount: string;
    vatAmount: string;
    grossAmount: string;
    notes: string | null;
    dueDate: string | null;
  };
};
