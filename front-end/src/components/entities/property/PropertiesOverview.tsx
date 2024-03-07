"use client";

import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";
import type { RouterOutput } from "@/utils/trpc";
import { Button, Stack } from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";

import { Table } from "../../common/Table";
import { DashboardHeader } from "../../layouts/dashboard/DashboardHeader";

type PropertiesPageProps = {
  properties: RouterOutput["property"]["list"];
};

export const PropertiesOverview = ({ properties }: PropertiesPageProps) => {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader
        title={[
          { icon: <IconBuilding />, label: t("dashboardLayout.properties") },
        ]}
      >
        <Button
          leftSection={<IconPlus />}
          component={Link}
          href="/properties/new"
        >
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Table
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/properties/${id}`);
        }}
        columns={[
          {
            selector: "name",
            label: t("entities.property.keys.name"),
          },
          {
            selector: "emailAddress",
            label: t("entities.property.keys.email"),
          },
          {
            selector: "phoneNumber",
            label: t("entities.property.keys.phoneNumber"),
          },
          {
            selector: "id",
            label: t("common.number"),
          },
        ]}
        elements={properties}
      />
    </Stack>
  );
};