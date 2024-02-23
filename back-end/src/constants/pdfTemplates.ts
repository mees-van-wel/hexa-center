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
    hasComments: boolean;
    totalDiscountAmount: string | null;
    lines: {
      name: string;
      comments: string | null;
      unitNetAmount: string;
      quantity: string;
      totalNetAmount: string;
      discountAmount: string | null;
      totalTaxAmount: string;
      taxPercentage: string;
      totalGrossAmount: string;
    }[];
    totalNetAmount: string;
    totalTaxAmount: string;
    totalGrossAmount: string;
    comments: string | null;
    dueDate: string | null;
  };
};
