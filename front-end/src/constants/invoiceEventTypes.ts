import {
  type Icon,
  IconFileArrowLeft,
  IconFileArrowRight,
  IconMailFast,
  type IconProps,
} from "@tabler/icons-react";
import react from "react";

import { TranslationPaths } from "@/types/translation";

export const INVOICE_EVENT_TYPES = {
  ISSUED: "issued",
  MAILED: "mailed",
  CREDITED: "credited",
} as const;

export type InvoiceEventTypes = typeof INVOICE_EVENT_TYPES;
export type InvoiceEventTypeKey = keyof InvoiceEventTypes;
export type InvoiceEventType = InvoiceEventTypes[InvoiceEventTypeKey];

export const INVOICE_EVENT_TYPE_KEYS = Object.keys(
  INVOICE_EVENT_TYPES,
) as InvoiceEventTypeKey[];

export const INVOICE_EVENT_TYPE_VALUES = Object.values(
  INVOICE_EVENT_TYPES,
) as InvoiceEventType[];

export const INVOICE_EVENT_TYPE_META: Record<
  InvoiceEventType,
  {
    IconComponent: react.ForwardRefExoticComponent<
      Omit<IconProps, "ref"> & react.RefAttributes<Icon>
    >;
    title: keyof TranslationPaths;
    message: keyof TranslationPaths;
  }
> = {
  [INVOICE_EVENT_TYPES.ISSUED]: {
    IconComponent: IconFileArrowRight,
    title: "entities.invoice.status.issued",
    message: "entities.invoice.issuedMessage",
  },
  [INVOICE_EVENT_TYPES.MAILED]: {
    IconComponent: IconMailFast,
    title: "entities.invoice.mailed",
    message: "entities.invoice.mailedMessage",
  },
  [INVOICE_EVENT_TYPES.CREDITED]: {
    IconComponent: IconFileArrowLeft,
    title: "entities.invoice.status.credited",
    message: "entities.invoice.creditedMessage",
  },
};
