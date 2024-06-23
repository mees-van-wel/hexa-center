import { TextInput } from "@mantine/core";
import { IconForms } from "@tabler/icons-react";

import type { FormElementConfig } from "../../types";

export const textInput: FormElementConfig = {
  icon: IconForms,
  component: ({ element }) => (
    <TextInput
      label={element?.config.label || "Text Input"}
      description={element?.config.description}
      withAsterisk={!element?.config.optional}
    />
  ),
};
