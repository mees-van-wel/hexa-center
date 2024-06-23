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
  | "dateinput"
  | "checkbox"
  | "multipleChoice";

export type FormMode = "read" | "preview" | "answer" | "manage";

type ElementComponentProps = {
  element: Element | null;
  formMode: FormMode;
};

type ElementPropertiesProps = {
  // TODO Typings
  config: any;
  updateConfig: (config: any) => void;
};

export type FormElementConfig = {
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  properties: FC<ElementPropertiesProps>;
  component: FC<ElementComponentProps>;
};
