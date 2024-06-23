import { Textarea } from "@mantine/core";
import { IconArrowAutofitHeight } from "@tabler/icons-react";

import { FormElementConfig } from "../../types";

export const textArea: FormElementConfig = {
  icon: IconArrowAutofitHeight,
  component: ({ element }) => (
    <Textarea
      label={element?.config.label || "Text Area"}
      description={element?.config.description}
      withAsterisk={!element?.config.optional}
      autosize
      minRows={2}
    />
  ),
};
