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
    name: string;
  };
};
