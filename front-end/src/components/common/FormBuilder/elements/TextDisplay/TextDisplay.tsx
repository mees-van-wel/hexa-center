import { IconLetterCase } from "@tabler/icons-react";

import { ElementConfig } from "../../types";

export const TextDisplay: ElementConfig = {
  icon: IconLetterCase,
  component: ({ element }) => (
    <div dangerouslySetInnerHTML={{ __html: element.config.value.content }} />
  ),
};
