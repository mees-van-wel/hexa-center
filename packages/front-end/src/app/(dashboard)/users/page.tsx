import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/Dashboard/DashboardHeader";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";
import { Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { cookies } from "next/headers";

export default async function Users() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const users = await trpc.user.list.query();

  return (
    <Stack>
      <DashboardHeader title={[{ content: "Users" }]}>
        <Button leftSection={<IconPlus />}>New</Button>
      </DashboardHeader>
      <Table
        columns={[
          {
            selector: "firstName",
            label: "First name",
          },
          {
            selector: "lastName",
            label: "Last name",
          },
          {
            selector: "email",
            label: "Email",
          },
          {
            selector: "phoneNumber",
            label: "Phone number",
          },
          {
            selector: "id",
            label: "Number",
          },
        ]}
        elements={users}
      />
    </Stack>
  );
}
