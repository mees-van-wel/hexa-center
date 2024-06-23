import { DateInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

import { FormElementConfig } from "../../types";

export const dateInput: FormElementConfig = {
  icon: IconCalendar,
  component: ({ element }) => (
    <DateInput
      label={element?.config.label || "Date Input"}
      description={element?.config.description}
      withAsterisk={!element?.config.optional}
    />
  ),
};
