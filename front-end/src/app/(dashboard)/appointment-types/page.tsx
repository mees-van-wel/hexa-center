"use client";

import { Button, ColorSwatch, Stack } from "@mantine/core";
import { IconCalendarStats, IconPlus } from "@tabler/icons-react";
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

  const listAppointmentTypes = useQuery("appointmentType", "list");

  return (
    <Stack>
      <DashboardHeader
        title={[
          {
            icon: <IconCalendarStats />,
            label: t("entities.appointmentType.pluralName"),
          },
        ]}
      >
        <Button
          leftSection={<IconPlus />}
          component={Link}
          href="/appointment-types/new"
        >
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      {listAppointmentTypes.loading || !listAppointmentTypes.data ? (
        <Loading />
      ) : (
        <Table
          elements={listAppointmentTypes.data}
          searchBarId={searchBarId}
          onClick={({ id }) => {
            router.push(`/appointment-types/${id}`);
          }}
          columns={[
            {
              selector: "name",
              label: t("entities.appointmentType.keys.name"),
            },
            {
              selector: "color",
              label: t("entities.appointmentType.keys.color"),
              format: (value) => <ColorSwatch color={value.color} />,
            },
            {
              selector: "id",
              label: t("entities.appointmentType.keys.number"),
            },
          ]}
        />
      )}
    </Stack>
  );
}
