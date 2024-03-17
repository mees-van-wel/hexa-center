"use client";

import { useEffect, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";
import type { RouterOutput } from "@/utils/trpc";
import { Button, Stack } from "@mantine/core";
import { IconPlus, IconUsers } from "@tabler/icons-react";

import { Table } from "../../common/Table";
import { DashboardHeader } from "../../layouts/dashboard/DashboardHeader";

type UsersOverviewProps = {
  users: RouterOutput["user"]["list"];
};

export const UsersOverview = ({ users }: UsersOverviewProps) => {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  useEffect(() => {
    router.refresh();
  }, []);

  console.log(users);

  return (
    <Stack>
      <DashboardHeader
        title={[{ icon: <IconUsers />, label: t("entities.user.pluralName") }]}
      >
        <Button leftSection={<IconPlus />} component={Link} href="/users/new">
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Table
        elements={users}
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/users/${id}`);
        }}
        columns={[
          {
            selector: "firstName",
            label: t("entities.user.firstName"),
          },
          {
            selector: "lastName",
            label: t("entities.user.lastName"),
          },
          {
            selector: "email",
            label: t("common.email"),
          },
          {
            selector: "phone",
            label: t("common.phone"),
          },
          {
            selector: "id",
            label: t("common.number"),
          },
        ]}
      />
    </Stack>
  );
};
