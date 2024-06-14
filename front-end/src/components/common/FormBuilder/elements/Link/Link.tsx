import { Button } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import type { ElementConfig } from "../../types";

export const Link: ElementConfig = {
  icon: IconExternalLink,
  component: ({ formMode, element }) => {
    return (
      <Button
        disabled={formMode === "manage"}
        component="a"
        href={element.config.url}
        target={element.config.newPage ? "_blank" : undefined}
      >
        {element.config.label}
      </Button>
    );
  },
};
