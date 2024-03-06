"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
import { Badge, Stack } from "@mantine/core";
import { IconFileEuro } from "@tabler/icons-react";

type InvoicesOverviewProps = {
  invoices: RouterOutput["invoice"]["list"];
};

export const InvoicesOverview = ({ invoices }: InvoicesOverviewProps) => {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader
        title={[
          { icon: <IconFileEuro />, label: t("entities.invoice.pluralName") },
        ]}
      >
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Table
        elements={invoices}
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/invoices/${id}`);
        }}
        columns={[
          {
            selector: "type",
            label: t("entities.invoice.type"),
            format: ({ type }) => (
              <Badge variant="light">{t(`entities.invoice.${type}`)}</Badge>
            ),
          },
          {
            selector: "status",
            label: t("entities.invoice.status"),
            format: ({ status }) => (
              <Badge variant="light">{t(`entities.invoice.${status}`)}</Badge>
            ),
          },
          {
            selector: "number",
            label: t("common.number"),
            format: ({ id, number }) => number || id,
          },
          {
            selector: "date",
            label: t("entities.invoice.date"),
            format: ({ createdAt, date }) =>
              (date ? "Issued at " : "Created at ") +
              dayjs(date || createdAt).format("DD-MM-YYYY"),
          },
          {
            selector: "customerName",
            label: t("entities.invoice.customerName"),
            format: ({ customerName, customer }) =>
              customerName || customer?.name,
          },
          {
            selector: "grossAmount",
            label: t("entities.invoice.totalGrossAmount"),
            format: ({ grossAmount }) =>
              // TODO Support preferences
              Intl.NumberFormat("nl-NL", {
                style: "currency",
                currency: "EUR",
              }).format(parseFloat(grossAmount)),
          },
        ]}
      />
    </Stack>
  );
};
