"use client";

import { useEffect, useId, useMemo } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Decimal from "decimal.js";

import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { type RouterOutput } from "@/utils/trpc";
import { AreaChart } from "@mantine/charts";
import { Badge, Paper, Stack, Title } from "@mantine/core";
import { IconFileEuro } from "@tabler/icons-react";

type InvoicesOverviewProps = {
  invoices: RouterOutput["invoice"]["list"];
};

const year = new Date().getFullYear();

export const InvoicesOverview = ({ invoices }: InvoicesOverviewProps) => {
  const router = useRouter();
  const searchBarId = useId();
  const t = useTranslation();

  const totalRevenueThisYear = useMemo(
    () =>
      Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(
        invoices
          .filter(({ date }) => date && date.getFullYear() === year)
          .reduce(
            (current, invoice) => current.add(invoice.netAmount),
            new Decimal(0),
          )
          .toNumber(),
      ),
    [invoices],
  );

  const totalRevenuePreviousYear = useMemo(
    () =>
      Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(
        invoices
          .filter(({ date }) => date && date.getFullYear() === year - 1)
          .reduce(
            (current, invoice) => current.add(invoice.netAmount),
            new Decimal(0),
          )
          .toNumber(),
      ),
    [invoices],
  );

  const data = useMemo(
    () =>
      invoices
        .reduce(
          (acc, invoice) => {
            if (!invoice.date) return acc;
            const index = invoice.date.getMonth();

            const clone = [...acc];
            const current = clone[index];

            clone[index] = {
              ...current,
              revenueThisYear:
                invoice.date.getFullYear() === year
                  ? current.revenueThisYear.add(invoice.netAmount)
                  : current.revenueThisYear,
              revenuePreviousYear:
                invoice.date.getFullYear() === year - 1
                  ? current.revenuePreviousYear.add(invoice.netAmount)
                  : current.revenuePreviousYear,
            };

            return clone;
          },
          [
            {
              date: "January",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "February",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "March",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "April",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "May",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "June",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "July",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "August",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "September",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "October",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "November",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
            {
              date: "December",
              revenueThisYear: new Decimal(0),
              revenuePreviousYear: new Decimal(0),
            },
          ],
        )
        .map((month) => ({
          ...month,
          revenueThisYear: month.revenueThisYear
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
            .toNumber(),
          revenuePreviousYear: month.revenuePreviousYear
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
            .toNumber(),
        })),
    [invoices],
  );

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <Stack>
      <DashboardHeader
        title={[
          { icon: <IconFileEuro />, label: t("entities.invoice.pluralName") },
        ]}
      >
        <Table.SearchBar id={searchBarId} />
      </DashboardHeader>
      <Paper p="md">
        <Title order={3}>
          {t("invoicePage.totalRevenueThis")}: {totalRevenueThisYear}
        </Title>
        <Title order={4} mb="md" c="dimmed">
          {t("invoicePage.totalRevenueLast")}: {totalRevenuePreviousYear}
        </Title>
        <AreaChart
          h={200}
          w="100%"
          data={data}
          dataKey="date"
          series={[
            {
              name: "revenueThisYear",
              label: t("invoicePage.revenueThis"),
              color: "blue.6",
            },
            {
              name: "revenuePreviousYear",
              label: t("invoicePage.revenueLast"),
              color: "gray.6",
            },
          ]}
          curveType="monotone"
        />
      </Paper>
      <Table
        elements={invoices}
        searchBarId={searchBarId}
        onClick={({ id }) => {
          router.push(`/invoices/${id}`);
        }}
        columns={[
          {
            selector: "type",
            label: t("entities.invoice.type.name"),
            format: ({ type }) => (
              <Badge variant="light">
                {t(`entities.invoice.type.${type}`)}
              </Badge>
            ),
          },
          {
            selector: "status",
            label: t("entities.invoice.status.name"),
            format: ({ status }) => (
              <Badge variant="light">
                {t(`entities.invoice.status.${status}`)}
              </Badge>
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
