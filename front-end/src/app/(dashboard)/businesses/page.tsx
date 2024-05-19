"use client";

import { Button, Stack } from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";

import { Loading } from "@/components/common/Loading";
import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";

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
        <Loading />
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
