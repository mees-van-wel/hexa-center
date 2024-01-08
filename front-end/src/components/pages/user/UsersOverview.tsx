"use client";

import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";
import type { RouterOutput } from "@/utils/trpc";
import { Button, Stack } from "@mantine/core";
import { IconPlus, IconUsers } from "@tabler/icons-react";

import { Table } from "../../common/Table";
import { DashboardHeader } from "../../layouts/dashboard/DashboardHeader";

type UsersPageProps = {
  users: RouterOutput["user"]["list"];
};

export const UsersOverview = ({ users }: UsersPageProps) => {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader
        title={[{ icon: <IconUsers />, label: t("dashboardLayout.users") }]}
      >
        <Button leftSection={<IconPlus />} component={Link} href="/users/new">
          New
        </Button>
        <Table.SearchBar id={searchBarId} />
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
