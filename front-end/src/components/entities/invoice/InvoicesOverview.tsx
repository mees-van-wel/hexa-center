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
            selector: "number",
            label: t("common.number"),
            format: ({ number }) =>
              number ? (
                number
              ) : (
                <Badge variant="light">{t("entities.invoice.draft")}</Badge>
              ),
          },
          // {
          //   selector: "issuedAt",
          //   label: t("entities.invoice.keys.status.name"),
          //   format: ({ issuedAt, creditedAt }) =>
          //     creditedAt ? (
          //       <Badge variant="light">
          //         {t("entities.invoice.keys.status.credited")}
          //       </Badge>
          //     ) : issuedAt ? (
          //       <Badge variant="light">
          //         {t(`entities.invoice.keys.status.issued`)}
          //       </Badge>
          //     ) : (
          //       <Badge variant="light">
          //         {t(`entities.invoice.keys.status.draft`)}
          //       </Badge>
          //     ),
          // },
          {
            selector: "date",
            label: t("entities.invoice.date"),
            format: ({ createdAt, date }) =>
              dayjs(date || createdAt).format("YYYY-MM-DD"),
          },
          {
            selector: "customerName",
            label: t("entities.invoice.customerName"),
          },
          {
            selector: "totalGrossAmount",
            label: t("entities.invoice.totalGrossAmount"),
            format: ({ totalGrossAmount }) =>
              // TODO Support preferences
              Intl.NumberFormat("nl-NL", {
                style: "currency",
                currency: "EUR",
              }).format(parseFloat(totalGrossAmount)),
          },
          {
            selector: "status",
            label: t("entities.invoice.status"),
            format: ({ status }) => (
              <Badge variant="light">{t(`entities.invoice.${status}`)}</Badge>
            ),
          },
        ]}
      />
    </Stack>
  );
};
