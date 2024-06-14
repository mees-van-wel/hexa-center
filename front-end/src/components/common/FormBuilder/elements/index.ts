import {
  IconArrowAutofitHeight,
  IconCalendar,
  IconCheckbox,
  IconCircle,
  IconExternalLink,
  IconForms,
  IconNumbers,
  IconSelector,
  IconSquare,
  IconTextWrap,
} from "@tabler/icons-react";

import type { ElementConfig, FormElementType } from "../types";
import { TextDisplay } from "./TextDisplay";

export const FormElements: Record<FormElementType, ElementConfig> = {
  textDisplay: TextDisplay,
  link: {
    icon: IconExternalLink,
  },
  textSmall: {
    icon: IconForms,
  },
  textLarge: {
    icon: IconArrowAutofitHeight,
  },
  textEditor: {
    icon: IconTextWrap,
  },
  number: {
    icon: IconNumbers,
  },
  date: {
    icon: IconCalendar,
  },
  checkbox: {
    icon: IconCheckbox,
  },
  multipleChoice: {
    icon: IconSquare,
  },
  singleChoice: {
    icon: IconCircle,
  },
  dropdown: {
    icon: IconSelector,
  },
};
