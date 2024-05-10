"use client";

import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Flex, Loader, Paper, Stack } from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";

export default function Page() {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  const listBusinesses = useQuery("business", "list");

  return (
    <Stack>
      <DashboardHeader
        title={[
          { icon: <IconBuilding />, label: t("entities.company.pluralName") },
        ]}
      >
        <Button
          leftSection={<IconPlus />}
          component={Link}
          href="/businesses/new"
        >
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      {listBusinesses.loading || !listBusinesses.data ? (
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
          elements={listBusinesses.data}
          searchBarId={searchBarId}
          onClick={({ id }) => {
            router.push(`/businesses/${id}`);
          }}
          columns={[
            {
              selector: "name",
              label: t("common.name"),
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
