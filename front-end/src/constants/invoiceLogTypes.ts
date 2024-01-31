import { TranslationPaths } from "@/types/translation";
import {
  IconFileArrowLeft,
  IconFileArrowRight,
  IconMailFast,
  TablerIconsProps,
} from "@tabler/icons-react";

export const INVOICE_LOG_TYPES = {
  ISSUED: "issued",
  MAILED: "mailed",
  CREDITED: "credited",
} as const;

export type InvoiceLogTypes = typeof INVOICE_LOG_TYPES;
export type InvoiceLogTypeKey = keyof InvoiceLogTypes;
export type InvoiceType = InvoiceLogTypes[InvoiceLogTypeKey];

export const INVOICE_LOG_TYPE_KEYS = Object.keys(
  INVOICE_LOG_TYPES,
) as InvoiceLogTypeKey[];
export const INVOICE_LOG_TYPE_VALUES = Object.values(
  INVOICE_LOG_TYPES,
) as InvoiceType[];

export const INVOICE_LOG_TYPE_META: Record<
  InvoiceType,
  {
    IconComponent: (props: TablerIconsProps) => JSX.Element;
    title: keyof TranslationPaths;
    message: keyof TranslationPaths;
  }
> = {
  [INVOICE_LOG_TYPES.ISSUED]: {
    IconComponent: IconFileArrowRight,
    title: "entities.invoice.issued",
    message: "entities.invoice.issuedMessage",
  },
  [INVOICE_LOG_TYPES.MAILED]: {
    IconComponent: IconMailFast,
    title: "entities.invoice.mailed",
    message: "entities.invoice.mailedMessage",
  },
  [INVOICE_LOG_TYPES.CREDITED]: {
    IconComponent: IconFileArrowLeft,
    title: "entities.invoice.credited",
    message: "entities.invoice.creditedMessage",
  },
};
