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
    customerStreet: string;
    customerHouseNumber: string;
    customerPostalCode: string;
    customerCity: string;
    customerCountry: string;
    customerEmailAddress: string;
    customerPhoneNumber: string;
    customerCocNumber: string | null;
    customerVatNumber: string | null;
    companyName: string;
    companyStreet: string;
    companyHouseNumber: string;
    companyPostalCode: string;
    companyCity: string;
    companyCountry: string;
    companyEmailAddress: string;
    companyPhoneNumber: string;
    companyCocNumber: string;
    companyVatNumber: string;
    companyIban: string;
    companySwiftBic: string;
    lines: {
      name: string;
      unitAmount: string;
      quantity: string;
      netAmount: string;
      vatAmount: string;
      vatPercentage: string;
      grossAmount: string;
    }[];
    netAmount: string;
    vatAmount: string;
    grossAmount: string;
    notes: string | null;
    dueDate: string | null;
  };
};
