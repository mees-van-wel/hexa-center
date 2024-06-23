import { Checkbox } from "@mantine/core";
import { IconCheckbox } from "@tabler/icons-react";

import { FormElementConfig } from "../../types";

export const checkbox: FormElementConfig = {
  icon: IconCheckbox,
  component: ({ element }) => (
    <Checkbox
      label={
        !element?.config.optional ? (
          <>
            {element?.config.label || "Checkbox"}
            <span
              aria-hidden="true"
              style={{
                color: "var(--mantine-color-error)",
              }}
            >
              {" *"}
            </span>
          </>
        ) : (
          element?.config.label || "Checkbox"
        )
      }
      description={element?.config.description}
    />
  ),
};
