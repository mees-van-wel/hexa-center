"use client";

import { useId, useMemo } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Decimal from "decimal.js";

import { Table } from "@/components/common/Table";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
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

  const totalIncomeThisYear = useMemo(
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

  const totalIncomePreviousYear = useMemo(
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
              incomeThisYear:
                invoice.date.getFullYear() === year
                  ? current.incomeThisYear.add(invoice.netAmount)
                  : current.incomeThisYear,
              incomePreviousYear:
                invoice.date.getFullYear() === year - 1
                  ? current.incomePreviousYear.add(invoice.netAmount)
                  : current.incomePreviousYear,
            };

            return clone;
          },
          [
            {
              date: "January",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "February",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "March",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "April",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "May",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "June",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "July",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "August",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "September",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "October",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "November",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
            {
              date: "December",
              incomeThisYear: new Decimal(0),
              incomePreviousYear: new Decimal(0),
            },
          ],
        )
        .map((month) => ({
          ...month,
          incomeThisYear: month.incomeThisYear
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
            .toNumber(),
          incomePreviousYear: month.incomePreviousYear
            .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
            .toNumber(),
        })),
    [invoices],
  );

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
        <Title order={3}>Total income this year: {totalIncomeThisYear}</Title>
        <Title order={4} mb="md" c="dimmed">
          Total income last year: {totalIncomePreviousYear}
        </Title>
        <AreaChart
          h={200}
          w="100%"
          data={data}
          dataKey="date"
          series={[
            {
              name: "incomeThisYear",
              label: "Income this year",
              color: "blue.6",
            },
            {
              name: "incomePreviousYear",
              label: "Income previous year",
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
