"use client";

import { Button, Stack } from "@mantine/core";
import { IconBed, IconPlus } from "@tabler/icons-react";
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

  const listRooms = useQuery("room", "list");

  return (
    <Stack>
      <DashboardHeader
        title={[{ icon: <IconBed />, label: t("entities.room.pluralName") }]}
      >
        <Button leftSection={<IconPlus />} component={Link} href="/rooms/new">
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      {listRooms.loading || !listRooms.data ? (
        <Loading />
      ) : (
        <Table
          elements={listRooms.data.sort((a, b) => a.name.localeCompare(b.name))}
          searchBarId={searchBarId}
          onClick={({ id }) => {
            router.push(`/rooms/${id}`);
          }}
          columns={[
            {
              selector: "name",
              label: t("common.name"),
            },
            {
              selector: "price",
              label: t("entities.room.price"),
              format: ({ price }) =>
                Intl.NumberFormat("nl-NL", {
                  style: "currency",
                  currency: "EUR",
                }).format(parseFloat(price)),
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
