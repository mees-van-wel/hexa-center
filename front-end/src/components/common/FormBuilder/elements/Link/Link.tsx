import { Button } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import type { FormElementConfig } from "../../types";

export const link: FormElementConfig = {
  icon: IconExternalLink,
  component: ({ element }) => {
    if (!element) return <Button>Link text</Button>;

    return (
      <Button
        component="a"
        href={element.config.url}
        target={element.config.newPage ? "_blank" : undefined}
      >
        {element.config.label}
      </Button>
    );
  },
};
