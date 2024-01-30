"use client";

import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
import { Button, Stack } from "@mantine/core";
import { IconBed, IconPlus } from "@tabler/icons-react";

type RoomsProps = {
  rooms: RouterOutput["room"]["list"];
};

export const Rooms = ({ rooms }: RoomsProps) => {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader
        title={[{ icon: <IconBed />, label: t("dashboardLayout.rooms") }]}
      >
        <Button component={Link} href="/rooms/new" leftSection={<IconPlus />}>
          {t("common.create")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Table
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/rooms/${id}`);
        }}
        columns={[
          {
            selector: "name",
            label: t("entities.room.keys.name"),
          },
          {
            selector: "price",
            label: t("entities.room.keys.price"),
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
