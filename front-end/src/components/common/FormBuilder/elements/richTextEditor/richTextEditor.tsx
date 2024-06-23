import { IconTextWrap } from "@tabler/icons-react";

import { RichTextEditor } from "@/components/common/RichTextEditor";

import { FormElementConfig } from "../../types";

export const richTextEditor: FormElementConfig = {
  icon: IconTextWrap,
  component: ({ element }) => (
    <RichTextEditor
      label={element?.config.label || "Rich Text Editor"}
      description={element?.config.description}
      required={!element?.config.optional}
    />
  ),
};
