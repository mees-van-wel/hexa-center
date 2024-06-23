import { IconLetterCase } from "@tabler/icons-react";

import { RichTextEditor } from "@/components/common/RichTextEditor";

import { FormElementConfig } from "../../types";

export const textDisplay: FormElementConfig = {
  icon: IconLetterCase,
  properties: ({ config, updateConfig }) => {
    return (
      <RichTextEditor
        value={config.content}
        onChange={(value) => {
          updateConfig({
            content: value,
          });
        }}
      />
    );
  },
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

    return <div dangerouslySetInnerHTML={{ __html: element.config.content }} />;
  },
};
