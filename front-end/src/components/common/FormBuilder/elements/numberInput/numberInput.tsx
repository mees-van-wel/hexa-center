import { NumberInput } from "@mantine/core";
import { IconNumbers } from "@tabler/icons-react";

import { FormElementConfig } from "../../types";

export const numberInput: FormElementConfig = {
  icon: IconNumbers,
  component: ({ element }) => (
    <NumberInput
      label={element?.config.label || "Number Input"}
      description={element?.config.description}
      withAsterisk={!element?.config.optional}
    />
  ),
};
