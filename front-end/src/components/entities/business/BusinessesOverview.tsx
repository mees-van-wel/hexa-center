"use client";

import { useEffect, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";
import type { RouterOutput } from "@/utils/trpc";
import { Button, Stack } from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";

import { Table } from "../../common/Table";
import { DashboardHeader } from "../../layouts/dashboard/DashboardHeader";

type BusinessPageProps = {
  businesses: RouterOutput["business"]["list"];
};

export const BusinessesOverview = ({ businesses }: BusinessPageProps) => {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <Stack>
      <DashboardHeader
        title={[
          { icon: <IconBuilding />, label: t("entities.business.pluralName") },
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
      <Table
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
        elements={businesses}
      />
    </Stack>
  );
};
