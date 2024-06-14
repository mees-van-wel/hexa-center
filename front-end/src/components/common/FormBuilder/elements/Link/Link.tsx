import { Button } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import type { ElementConfig } from "../../types";

export const Link: ElementConfig = {
  icon: IconExternalLink,
  component: ({ formMode, element }) => {
    if (formMode === "manage" || !element) return <Button>Link text</Button>;

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
