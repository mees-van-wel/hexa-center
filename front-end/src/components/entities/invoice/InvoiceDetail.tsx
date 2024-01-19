"use client";

import Link from "next/link";
import dayjs from "dayjs";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
import {
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Table,
  Title,
} from "@mantine/core";
import { IconExternalLink, IconFileEuro } from "@tabler/icons-react";

type InvoiceDetailProps = {
  invoice: RouterOutput["invoice"]["get"];
};

export const InvoiceDetail = ({ invoice }: InvoiceDetailProps) => {
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader
        backRouteFallback="/invoices"
        title={[
          {
            icon: <IconFileEuro />,
            label: t("entities.invoice.name.plural"),
            href: "/invoices",
          },
          { label: invoice.number },
        ]}
      >
        {/* <Button
          color="red"
          variant="light"
          onClick={deletehandler}
          leftSection={<IconTrash />}
          loading={deleteUser.loading}
        >
          {t("common.delete")}
        </Button> */}
      </DashboardHeader>
      <Group align="stretch">
        <Paper component={Stack} p="md" style={{ flex: 1 }}>
          <Group align="flex-start" justify="space-between" wrap="nowrap">
            <div>
              <Group gap="xs">
                <Title order={3}>Invoice</Title>
                <Badge>
                  {t(`entities.invoice.keys.status.${invoice.status}`)}
                </Badge>
              </Group>
              <p>
                {t("common.number")}: {invoice.number}
              </p>
              <p>
                {t("entities.invoice.keys.issueDate")}:{" "}
                {dayjs(invoice.issueDate).format("YYYY-MM-DD")}
              </p>
              <p>
                {t("entities.invoice.keys.totalGrossAmount")}:{" "}
                {Intl.NumberFormat("nl-NL", {
                  style: "currency",
                  currency: "EUR",
                }).format(invoice.totalGrossAmount)}
              </p>
            </div>
            <Stack>
              {invoice.comments && (
                <div>
                  <Title order={3}>Comments</Title>
                  <p>{invoice.comments}</p>
                </div>
              )}
              <Stack gap="xs">
                <Title order={3}>Origin</Title>
                <Button leftSection={<IconExternalLink />}>
                  {invoice.refType} {invoice.refId}
                </Button>
              </Stack>
            </Stack>
          </Group>
        </Paper>
        <Paper component={Stack} p="md" style={{ flex: 1 }}>
          <Group justify="space-between">
            <Title order={3}>Customer</Title>
            <Title>-</Title>
            <Title order={2}>Addresses</Title>
            <Title>-</Title>
            <Title order={3}>Company</Title>
          </Group>
          <Group align="flex-start" justify="space-between" wrap="nowrap">
            <Stack align="flex-start">
              {invoice.customerId ? (
                <Button
                  component={Link}
                  size="compact-md"
                  href={`/relations/${invoice.customerId}`}
                  variant="light"
                >
                  {invoice.customerName}
                </Button>
              ) : (
                <p>{invoice.customerName}</p>
              )}
              <div>
                <p style={{ whiteSpace: "nowrap" }}>
                  {invoice.customerStreet} {invoice.customerHouseNumber}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>
                  {invoice.customerPostalCode} {invoice.customerCity}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>
                  {invoice.customerRegion}
                  {" - "}
                  {t(`constants.countries.${invoice.customerCountry}`)}
                </p>
              </div>
              <div>
                <p style={{ whiteSpace: "nowrap" }}>
                  Email address: {invoice.customerEmailAddress}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>
                  Phone number: {invoice.customerPhoneNumber}
                </p>
              </div>
              <div>
                <p style={{ whiteSpace: "nowrap" }}>
                  VAT number: {invoice.customerVatNumber}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>
                  CoC number: {invoice.customerCocNumber}
                </p>
              </div>
            </Stack>
            <Stack align="flex-end" style={{ textAlign: "right" }}>
              {invoice.customerId ? (
                <Button
                  component={Link}
                  size="compact-md"
                  href={`/properties/${invoice.companyId}`}
                  variant="light"
                >
                  {invoice.companyName}
                </Button>
              ) : (
                <p>{invoice.customerName}</p>
              )}
              <div>
                <p style={{ whiteSpace: "nowrap" }}>
                  {invoice.companyStreet} {invoice.companyHouseNumber}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>
                  {invoice.companyPostalCode} {invoice.companyCity}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>
                  {invoice.companyRegion}
                  {" - "}
                  {t(`constants.countries.${invoice.companyCountry}`)}
                </p>
              </div>
              <div>
                <p style={{ whiteSpace: "nowrap" }}>
                  Email address: {invoice.companyEmailAddress}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>
                  Phone number: {invoice.companyPhoneNumber}
                </p>
              </div>
              <div>
                <p style={{ whiteSpace: "nowrap" }}>
                  VAT number: {invoice.companyVatNumber}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>
                  CoC number: {invoice.companyCocNumber}
                </p>
              </div>
              <div>
                <p style={{ whiteSpace: "nowrap" }}>
                  IBAN: {invoice.companyIban}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>
                  BIC/SWIFT: {invoice.companySwiftBic}
                </p>
              </div>
            </Stack>
          </Group>
        </Paper>
      </Group>
      <Paper component={Stack} p="md" style={{ flex: 1 }}>
        <Title order={3}>Lines</Title>
        <Table></Table>
      </Paper>
    </Stack>
  );
};
