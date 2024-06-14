type BaseConfig = {
  label: string;
  description: string;
};

type TextDisplayConfig = {
  type: "textDisplay";
  value: {
    content: string;
  };
};

type LinkConfig = {
  type: "link";
  value: { label: string; url: string; newPage: boolean };
};

type TextInputConfig = {
  type: "textInput";
  value: BaseConfig;
};

type TextAreaConfig = {
  type: "textArea";
  value: BaseConfig;
};

type RichTextEditorConfig = {
  type: "richTextEditor";
  value: BaseConfig;
};

type NumberInputConfig = {
  type: "numberInput";
  value: BaseConfig;
};

type DatePickerConfig = {
  type: "datePicker";
  value: BaseConfig;
};

type CheckboxConfig = {
  type: "checkbox";
  value: BaseConfig;
};

type MultipleChoiceConfig = {
  type: "multipleChoice";
  value: BaseConfig & {
    options: BaseConfig & { id: string; position: number }[];
    mulitple: boolean;
    variant: "list" | "dropdown";
  };
};

export type FormElementConfig =
  | TextDisplayConfig
  | LinkConfig
  | TextInputConfig
  | TextAreaConfig
  | RichTextEditorConfig
  | NumberInputConfig
  | DatePickerConfig
  | CheckboxConfig
  | MultipleChoiceConfig;
