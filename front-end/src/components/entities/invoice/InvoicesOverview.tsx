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
          { icon: <IconFileEuro />, label: t("entities.invoice.name.plural") },
        ]}
      >
        {/* <Button
          leftSection={<IconPlus />}
          component={Link}
          href="/invoices/new"
        >
          {t("common.new")}
        </Button> */}
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
            label: t("entities.invoice.keys.type.name"),
            format: (value) => (
              <Badge variant="light">
                {t(`entities.invoice.keys.type.${value}`)}
              </Badge>
            ),
          },
          {
            selector: "number",
            label: t("common.number"),
          },
          {
            selector: "issueDate",
            label: t("entities.invoice.keys.issueDate"),
            format: (value) => dayjs(value).format("YYYY-MM-DD"),
          },
          {
            selector: "customerName",
            label: t("entities.invoice.keys.customerName"),
          },
          {
            selector: "totalGrossAmount",
            label: t("entities.invoice.keys.totalGrossAmount"),
            format: (value) =>
              // TODO Support preferences
              Intl.NumberFormat("nl-NL", {
                style: "currency",
                currency: "EUR",
              }).format(value),
          },
          {
            selector: "status",
            label: t("entities.invoice.keys.status.name"),
            format: (value) => (
              <Badge variant="light">
                {t(`entities.invoice.keys.status.${value}`)}
              </Badge>
            ),
          },
        ]}
      />
    </Stack>
  );
};
