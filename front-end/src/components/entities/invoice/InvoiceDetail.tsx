"use client";

import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";

import { Band } from "@/components/common/Band";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
import {
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Timeline,
  Title,
} from "@mantine/core";
import {
  IconDownload,
  IconFileArrowLeft,
  IconFileArrowRight,
  IconFileEuro,
  IconMailFast,
  IconPlus,
  IconPrinter,
} from "@tabler/icons-react";

type InvoiceDetailProps = {
  invoice: RouterOutput["invoice"]["get"];
};

export const InvoiceDetail = ({ invoice }: InvoiceDetailProps) => {
  const t = useTranslation();
  const generatePdf = useMutation("invoice", "generatePdf");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  const downloadHandler = async () => {
    setDownloadLoading(true);

    const base64PDF = await generatePdf.mutate(invoice.id);
    const link = document.createElement("a");

    link.href = `data:application/pdf;base64,${base64PDF}`;
    link.download = `${invoice.number}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setDownloadLoading(false);
  };

  const printHandler = async () => {
    setPrintLoading(true);
    const base64PDF = await generatePdf.mutate(invoice.id);

    const byteCharacters = atob(base64PDF);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl);

    if (printWindow)
      printWindow.onload = function () {
        printWindow.print();
        URL.revokeObjectURL(blobUrl);
      };
    else alert("Please allow popups to print the document.");

    setPrintLoading(false);
  };

  return (
    <Stack>
      <DashboardHeader
        backRouteFallback="/invoices"
        title={[
          {
            icon: <IconFileEuro />,
            label: t("entities.invoice.pluralName"),
            href: "/invoices",
          },
          { label: invoice.number },
        ]}
      >
        <Button
          loading={downloadLoading}
          leftSection={<IconDownload />}
          onClick={downloadHandler}
        >
          Download
        </Button>
        <Button
          loading={printLoading}
          leftSection={<IconPrinter />}
          onClick={printHandler}
        >
          Print
        </Button>
        <Button leftSection={<IconMailFast />}>Mail</Button>
        <Button leftSection={<IconFileArrowLeft />} variant="light">
          Credit
        </Button>
      </DashboardHeader>
      <Group wrap="nowrap" align="stretch">
        <Paper p="2rem" style={{ flex: 1 }}>
          <Band
            title={
              <Group>
                <Title order={3}>Invoice</Title>
                <Badge>
                  {t(
                    invoice.creditedAt
                      ? "entities.invoice.credited"
                      : invoice.issuedAt
                        ? "entities.invoice.issued"
                        : "entities.invoice.draft",
                  )}
                </Badge>
              </Group>
            }
            fh
          >
            <Group align="stretch" justify="space-between" gap="2rem">
              <Stack>
                <div>
                  <p>
                    {t("common.number")}: {invoice.number}
                  </p>
                  <p>
                    {t("entities.invoice.totalGrossAmount")}:{" "}
                    {Intl.NumberFormat("nl-NL", {
                      style: "currency",
                      currency: "EUR",
                    }).format(parseFloat(invoice.totalGrossAmount))}
                  </p>
                </div>
                <div>
                  <p>
                    {t("entities.invoice.date")}:{" "}
                    {dayjs(invoice.date || invoice.createdAt).format(
                      "YYYY-MM-DD",
                    )}
                  </p>
                  {/* <p>
                    {t("entities.invoice.dueAt")}:{" "}
                    {dayjs(invoice.dueAt).format("YYYY-MM-DD")}
                  </p> */}
                </div>
              </Stack>
            </Group>
          </Band>
        </Paper>
        <Paper p="2rem">
          <Band.Group align="stretch">
            <Band
              title={
                <Group>
                  <Title order={3}>Customer</Title>
                  <Title order={3}>-</Title>
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
                </Group>
              }
            >
              <Stack>
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
                {(invoice.customerVatNumber || invoice.customerCocNumber) && (
                  <div>
                    {invoice.customerVatNumber && (
                      <p style={{ whiteSpace: "nowrap" }}>
                        VAT number: {invoice.customerVatNumber}
                      </p>
                    )}
                    {invoice.customerCocNumber && (
                      <p style={{ whiteSpace: "nowrap" }}>
                        CoC number: {invoice.customerCocNumber}
                      </p>
                    )}
                  </div>
                )}
              </Stack>
            </Band>
            <Band
              title={
                <Group>
                  <Title order={3}>Your details</Title>
                  <Title order={3}>-</Title>
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
                </Group>
              }
            >
              <Stack>
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
            </Band>
          </Band.Group>
        </Paper>
        <Paper p="2rem">
          <Band title={<Title order={3}>Timeline</Title>} fh>
            <Timeline
              active={invoice.creditedAt ? 2 : invoice.issuedAt ? 1 : 0}
              bulletSize="2rem"
              lineWidth={3}
            >
              <Timeline.Item
                bullet={<IconPlus size="1.3rem" />}
                title="Created"
              >
                <Text c="dimmed" size="sm">
                  The invoice was created
                </Text>
                <Text size="xs" mt={4}>
                  {dayjs(invoice.createdAt).format("YYYY-MM-DD")}
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconFileArrowRight size="1.3rem" />}
                title="Issued"
              >
                <Text c="dimmed" size="sm">
                  The invoice was issued
                </Text>
                <Text size="xs" mt={4}>
                  {invoice.issuedAt
                    ? dayjs(invoice.issuedAt).format("YYYY-MM-DD")
                    : "..."}
                </Text>
              </Timeline.Item>

              {invoice.creditedAt && (
                <Timeline.Item
                  title="Credited"
                  bullet={<IconFileArrowLeft size="1.3rem" />}
                >
                  {/* <Text c="dimmed" size="sm">
                  <Text variant="link" component="span" inherit>
                    Robert Gluesticker
                  </Text>{" "}
                  left a code review on your pull request
                </Text> */}
                  <Text size="xs" mt={4}>
                    {dayjs(invoice.creditedAt).format("YYYY-MM-DD")}
                  </Text>
                </Timeline.Item>
              )}
            </Timeline>
          </Band>
        </Paper>
      </Group>
      <Paper p="2rem">
        <Band title={<Title order={3}>Lines</Title>}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Comments</Table.Th>
                <Table.Th>Unit price</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Total net amount</Table.Th>
                <Table.Th>Discount</Table.Th>
                <Table.Th>VAT</Table.Th>
                <Table.Th>Total gross amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {invoice.lines.map(
                ({
                  id,
                  name,
                  comments,
                  unitNetAmount,
                  quantity,
                  discountAmount,
                  totalNetAmount,
                  totalTaxAmount,
                  taxPercentage,
                  totalGrossAmount,
                }) => (
                  <Table.Tr key={id}>
                    <Table.Td>{id}</Table.Td>
                    <Table.Td>{name}</Table.Td>
                    <Table.Td>{comments}</Table.Td>
                    <Table.Td>
                      {Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(parseFloat(unitNetAmount))}
                    </Table.Td>
                    <Table.Td>{quantity}x</Table.Td>
                    <Table.Td>
                      {Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(parseFloat(totalNetAmount))}
                    </Table.Td>
                    <Table.Td>
                      {Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(parseFloat(discountAmount))}
                    </Table.Td>
                    <Table.Td>
                      {Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(parseFloat(totalTaxAmount))}{" "}
                      ({taxPercentage}%)
                    </Table.Td>
                    <Table.Td>
                      {Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(parseFloat(totalGrossAmount))}
                    </Table.Td>
                  </Table.Tr>
                ),
              )}
              <Table.Tr
                style={{
                  fontSize: "1.25rem",
                }}
              >
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                />
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                />
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                />
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                />
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                >
                  <Text size="1.25rem" fw={700}>
                    Total
                  </Text>
                </Table.Td>
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                >
                  {Intl.NumberFormat("nl-NL", {
                    style: "currency",
                    currency: "EUR",
                  }).format(parseFloat(invoice.totalNetAmount))}
                </Table.Td>
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                >
                  {Intl.NumberFormat("nl-NL", {
                    style: "currency",
                    currency: "EUR",
                  }).format(parseFloat(invoice.totalDiscountAmount))}
                </Table.Td>
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                >
                  {Intl.NumberFormat("nl-NL", {
                    style: "currency",
                    currency: "EUR",
                  }).format(parseFloat(invoice.totalTaxAmount))}
                </Table.Td>
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                >
                  {Intl.NumberFormat("nl-NL", {
                    style: "currency",
                    currency: "EUR",
                  }).format(parseFloat(invoice.totalGrossAmount))}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Band>
      </Paper>
    </Stack>
  );
};
