"use client";

import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";
import type { RouterOutput } from "@/utils/trpc";
import { Badge, Button, Stack } from "@mantine/core";
import { IconPlus, IconUsers } from "@tabler/icons-react";

import { Table } from "../../common/Table";
import { DashboardHeader } from "../../layouts/dashboard/DashboardHeader";

type RelationOverviewProps = {
  relations: RouterOutput["relation"]["list"];
};

export const RelationsOverview = ({ relations }: RelationOverviewProps) => {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader
        title={[
          { icon: <IconUsers />, label: t("entities.relation.name.plural") },
        ]}
      >
        <Button
          leftSection={<IconPlus />}
          component={Link}
          href="/relations/new"
        >
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Table
        elements={relations}
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/relations/${id}`);
        }}
        columns={[
          {
            selector: "type",
            label: t("entities.relation.keys.type"),
            format: ({ type }) => (
              <Badge variant="light">
                {t(`constants.relationTypes.${type}`)}
              </Badge>
            ),
          },
          {
            selector: "name",
            label: t("entities.relation.keys.name"),
            format: ({ type, name, businessContactName }) =>
              type === "business" && businessContactName
                ? `${name} - ${businessContactName}`
                : name,
          },
          {
            selector: "emailAddress",
            label: t("entities.relation.keys.emailAddress"),
          },
          {
            selector: "phoneNumber",
            label: t("entities.relation.keys.phoneNumber"),
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
