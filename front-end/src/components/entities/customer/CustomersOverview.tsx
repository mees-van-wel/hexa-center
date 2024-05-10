"use client";

import { Button, Stack } from "@mantine/core";
import { IconPlus, IconUserDollar } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId } from "react";

import { useTranslation } from "@/hooks/useTranslation";
import type { RouterOutput } from "@/utils/trpc";

import { Table } from "../../common/Table";
import { DashboardHeader } from "../../layouts/dashboard/DashboardHeader";

type CustomersOverviewProps = {
  customers: RouterOutput["customer"]["list"];
};

export const CustomersOverview = ({ customers }: CustomersOverviewProps) => {
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
          {
            icon: <IconUserDollar />,
            label: t("entities.customer.pluralName"),
          },
        ]}
      >
        <Button
          leftSection={<IconPlus />}
          component={Link}
          href="/customers/new"
        >
          {t("common.new")}
        </Button>
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Table
        elements={customers}
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/customers/${id}`);
        }}
        columns={[
          {
            selector: "name",
            label: t("common.name"),
            format: ({ name, contactPersonName }) =>
              contactPersonName ? `${name} - ${contactPersonName}` : name,
          },
          {
            selector: "email",
            label: t("common.email"),
            format: ({ email, contactPersonEmail }) =>
              `${email || ""}${email && contactPersonEmail ? " - " : ""}${
                contactPersonEmail || ""
              }`,
          },
          {
            selector: "phone",
            label: t("common.phone"),
            format: ({ phone, contactPersonPhone }) =>
              `${phone || ""}${phone && contactPersonPhone ? " - " : ""}${
                contactPersonPhone || ""
              }`,
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
