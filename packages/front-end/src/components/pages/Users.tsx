"use client";

import type { RouterOutput } from "@/utils/trpc";
import { Button, Stack } from "@mantine/core";
import { DashboardHeader } from "../layouts/dashboard/DashboardHeader";
import { IconPlus, IconUsers } from "@tabler/icons-react";
import { Table } from "../common/Table";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UsersPageProps = {
  users: RouterOutput["user"]["list"];
};

export const Users = ({ users }: UsersPageProps) => {
  const router = useRouter();

  return (
    <Stack>
      <DashboardHeader title={[{ icon: <IconUsers />, label: "Users" }]}>
        <Button leftSection={<IconPlus />} component={Link} href="/users/new">
          New
        </Button>
      </DashboardHeader>
      <Table
        onClick={({ id }) => {
          router.push(`/users/${id}`);
        }}
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
};
