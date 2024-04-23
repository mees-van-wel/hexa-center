"use client";

import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Flex, Loader, Paper, Stack } from "@mantine/core";
import { IconPlus, IconUsers } from "@tabler/icons-react";

export default function Page() {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  const listUsers = useQuery("user", "list");

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
      {listUsers.loading || !listUsers.data ? (
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
          component={Paper}
          p="md"
        >
          <Loader />
        </Flex>
      ) : (
        <Table
          elements={listUsers.data}
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
      )}
    </Stack>
  );
}
