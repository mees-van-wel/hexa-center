"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { DashboardHeader } from "@/components/layouts/Dashboard/DashboardHeader";
import { Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Table } from "@/components/common/Table";
import Link from "next/link";

type RoomsProps = {
  elements: Record<string, any>[];
};

export const Rooms = ({ elements }: RoomsProps) => {
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader title={[{ content: t("roomsPage.rooms") }]}>
        <Button component={Link} href="/rooms/new" leftSection={<IconPlus />}>
          {t("common.create")}
        </Button>
      </DashboardHeader>
      <Table
        columns={[
          {
            selector: "name",
            label: t("roomsPage.name"),
          },
          {
            selector: "price",
            label: t("roomsPage.price"),
          },
          {
            selector: "id",
            label: t("common.number"),
          },
        ]}
        elements={elements}
      />
    </Stack>
  );
};
