"use client";

import Link from "next/link";

import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
import { Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type RoomsProps = {
  rooms: RouterOutput["room"]["list"];
};

export const Rooms = ({ rooms }: RoomsProps) => {
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader title={[{ label: t("dashboardLayout.rooms") }]}>
        <Button component={Link} href="/rooms/new" leftSection={<IconPlus />}>
          {t("common.create")}
        </Button>
      </DashboardHeader>
      <Table
        columns={[
          {
            selector: "name",
            label: t("common.name"),
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
        elements={rooms}
      />
    </Stack>
  );
};
