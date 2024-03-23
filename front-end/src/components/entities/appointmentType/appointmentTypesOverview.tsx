"use client";

import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@back-end/routes/_app";
import { Button, ColorSwatch, Stack } from "@mantine/core";
import { IconCalendarStats, IconPlus } from "@tabler/icons-react";

import { Table } from "../../common/Table";

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
            label: t("dashboardLayout.appointmentTypes"),
          },
        ]}
      >
        <Button
          leftSection={<IconPlus />}
          component={Link}
          href="/appointmentType/new"
        >
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Table
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/appointmentType/${id}`);
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
