type TextDisplayConfig = {
  type: "textDisplay";
  content: string;
};

type LinkConfig = {
  type: "link";
  label: string;
  url: string;
  newPage: boolean;
};

type TextInputConfig = {
  type: "textInput";
  label: string;
  description: string;
  optional: boolean;
};

type TextAreaConfig = {
  type: "textArea";
  label: string;
  description: string;
  optional: boolean;
};

type RichTextEditorConfig = {
  type: "richTextEditor";
  label: string;
  description: string;
  optional: boolean;
};

type NumberInputConfig = {
  type: "numberInput";
  label: string;
  description: string;
  optional: boolean;
};

type DateInputConfig = {
  type: "dateInput";
  label: string;
  description: string;
  optional: boolean;
};

type CheckboxConfig = {
  type: "checkbox";
  label: string;
  description: string;
  optional: boolean;
};

type MultipleChoiceConfig = {
  type: "multipleChoice";
  label: string;
  description: string;
  optional: boolean;
  options: {
    label: string;
    description: string;
    id: string;
    position: number;
  }[];
  mulitple: boolean;
  variant: "list" | "dropdown";
};

export type FormElementConfig =
  | TextDisplayConfig
  | LinkConfig
  | TextInputConfig
  | TextAreaConfig
  | RichTextEditorConfig
  | NumberInputConfig
  | DateInputConfig
  | CheckboxConfig
  | MultipleChoiceConfig;
