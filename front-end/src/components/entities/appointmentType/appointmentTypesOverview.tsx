"use client";

import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@back-end/routes/_app";
import { Button, ColorSwatch, Stack } from "@mantine/core";
import { IconCalendarStats, IconPlus } from "@tabler/icons-react";

type AppointmentTypesPageProps = {
  appointmentTypes: RouterOutput["appointmentType"]["list"];
};

export const AppointmentTypesOverview = ({
  appointmentTypes,
}: AppointmentTypesPageProps) => {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader
        title={[
          {
            icon: <IconCalendarStats />,
            label: t("entities.appointmentType.name.plural"),
          },
        ]}
      >
        <Button
          leftSection={<IconPlus />}
          component={Link}
          href="/appointmentTypes/new"
        >
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Table
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/appointmentTypes/${id}`);
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
        elements={appointmentTypes}
      />
    </Stack>
  );
};
