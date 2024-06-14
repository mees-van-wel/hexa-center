import {
  IconArrowAutofitHeight,
  IconCalendar,
  IconCheckbox,
  IconForms,
  IconNumbers,
  IconSquare,
  IconTextWrap,
} from "@tabler/icons-react";

import type { ElementConfig, FormElementType } from "../types";
import { Link } from "./Link";
import { TextDisplay } from "./TextDisplay";

export const FormElements: Record<FormElementType, ElementConfig> = {
  textDisplay: TextDisplay,
  link: Link,
  textInput: {
    icon: IconForms,
  },
  textArea: {
    icon: IconArrowAutofitHeight,
  },
  richTextEditor: {
    icon: IconTextWrap,
  },
  numberInput: {
    icon: IconNumbers,
  },
  datePicker: {
    icon: IconCalendar,
  },
  checkbox: {
    icon: IconCheckbox,
  },
  multipleChoice: {
    icon: IconSquare,
  },
};
