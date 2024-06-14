import type { Icon, IconProps } from "@tabler/icons-react";
import type { FC, ForwardRefExoticComponent, RefAttributes } from "react";

import type { RouterOutput } from "@/utils/trpc";

export type Form = RouterOutput["form"]["get"];
export type Section = Form["sections"][number];
export type Element = Section["elements"][number];
export type Value = Element["values"][number];

export type FormElementType =
  | "textDisplay"
  | "link"
  | "textInput"
  | "textArea"
  | "richTextEditor"
  | "numberInput"
  | "datePicker"
  | "checkbox"
  | "multipleChoice";

export type FormMode = "read" | "preview" | "answer" | "manage";

type ElementComponentProps = {
  element: Element;
  formMode: FormMode;
};

export type ElementConfig = {
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  component: FC<ElementComponentProps>;
};
