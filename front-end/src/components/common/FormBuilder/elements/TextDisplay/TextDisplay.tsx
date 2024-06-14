import { IconLetterCase } from "@tabler/icons-react";

import { ElementConfig } from "../../types";

export const TextDisplay: ElementConfig = {
  icon: IconLetterCase,
  component: ({ formMode, element }) => {
    if (formMode === "manage" || !element)
      return (
        <div>
          <h3>[Placeholder] This is a text display element</h3>
          <p>
            You can edit this text in the properties panel
            <br /> on the right.{" "}
          </p>
        </div>
      );

    return (
      <div dangerouslySetInnerHTML={{ __html: element.config.value.content }} />
    );
  },
};
