import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { Stack } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";

export default function Page() {
  return (
    <Stack>
      <DashboardHeader
        title={[
          {
            icon: <IconUsers />,
            label: "Users",
            href: "/users",
          },
          {
            label: "New",
          },
        ]}
      ></DashboardHeader>
    </Stack>
  );
}
