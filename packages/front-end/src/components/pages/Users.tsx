"use client";

import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { RouterOutput } from "@/utils/trpc";
import { Button, Stack } from "@mantine/core";
import { IconPlus, IconUsers } from "@tabler/icons-react";

import { Table } from "../common/Table";
import { DashboardHeader } from "../layouts/dashboard/DashboardHeader";

type UsersPageProps = {
  users: RouterOutput["user"]["list"];
};

export const Users = ({ users }: UsersPageProps) => {
  const router = useRouter();
  const searchBarId = useId();

  return (
    <Stack>
      <DashboardHeader title={[{ icon: <IconUsers />, label: "Users" }]}>
        <Table.SearchBar id={searchBarId} />
        <Button leftSection={<IconPlus />} component={Link} href="/users/new">
          New
        </Button>
      </DashboardHeader>
      <Table
        searchBarId={searchBarId}
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
