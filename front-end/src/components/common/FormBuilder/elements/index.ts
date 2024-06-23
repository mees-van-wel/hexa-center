import { IconListDetails } from "@tabler/icons-react";

import type { FormElementConfig, FormElementType } from "../types";
import { checkbox } from "./checkbox";
import { dateInput } from "./dateInput";
import { link } from "./link";
import { numberInput } from "./numberInput";
import { richTextEditor } from "./richTextEditor";
import { textArea } from "./textArea";
import { textDisplay } from "./textDisplay";
import { textInput } from "./textInput";

export const formElements: Record<FormElementType, FormElementConfig> = {
  textDisplay,
  link,
  textInput,
  textArea,
  richTextEditor,
  numberInput,
  dateInput,
  checkbox,
  multipleChoice: {
    icon: IconListDetails,
  },
};
