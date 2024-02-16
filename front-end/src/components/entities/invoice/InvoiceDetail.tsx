"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { Band } from "@/components/common/Band";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { INVOICE_EVENT_TYPE_META } from "@/constants/invoiceEventTypes";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
import {
  Badge,
  Button,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Timeline,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconExternalLink,
  IconFileArrowLeft,
  IconFileArrowRight,
  IconFileEuro,
  IconMailFast,
  IconPlus,
  IconPrinter,
} from "@tabler/icons-react";
import { IconDownload } from "@tabler/icons-react";

const now = new Date();

type InvoiceDetailProps = {
  invoice: RouterOutput["invoice"]["get"];
};

// TODO Implement credit Handler
// TODO Fix type errors
// TODO Translations
export const InvoiceDetail = ({ invoice }: InvoiceDetailProps) => {
  const t = useTranslation();
  const issueInvoice = useMutation("invoice", "issue");
  const generatePdf = useMutation("invoice", "generatePdf");
  const mailInvoice = useMutation("invoice", "mail");
  const [issueLoading, setIssueLoading] = useState(false);
  const [issueDate, setIssueDate] = useState<Date | null>(now);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [mailLoading, setmailLoading] = useState(false);
  const router = useRouter();

  const issueHandler = async () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      children: (
        <DateInput
          label="Date"
          withAsterisk
          defaultValue={issueDate}
          onChange={setIssueDate}
        />
      ),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        setIssueLoading(true);

        try {
          await issueInvoice.mutate({
            invoiceId: invoice.id,
            date: issueDate,
          });

          router.refresh();

          notifications.show({
            message: "Issued successfully",
            color: "green",
          });
        } catch (error) {
          notifications.show({
            title: "There was an error while issuing",
            message: error?.message || "...",
            color: "red",
          });
        }

        setIssueLoading(false);
      },
    });
  };

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

  const mailHandler = async () => {
    setmailLoading(true);

    try {
      await mailInvoice.mutate(invoice.id);

      router.refresh();

      notifications.show({
        message: "Mailed successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "There was an error while mailing",
        message: error?.message || "...",
        color: "red",
      });
    }

    setmailLoading(false);
  };

  const creditHandler = async () => {};

  const canCredit = useMemo(
    () =>
      invoice.events.some(({ type }) => type === "issued") &&
      !invoice.events.some(({ type }) => type === "credited") &&
      invoice.type !== "credit" &&
      invoice.type !== "quotation",
    [invoice.events, invoice.type],
  );

  const hasBeenMailed = useMemo(
    () => invoice.events.some(({ type }) => type === "mailed"),
    [invoice.events],
  );

  const customerVatNumber =
    invoice.customerVatNumber || invoice.customer?.vatNumber;

  const customerCocNumber =
    invoice.customerCocNumber || invoice.customer?.cocNumber;

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
          { label: invoice.number || invoice.id.toString() },
        ]}
      >
        {invoice.status === "draft" ? (
          <Button
            loading={issueLoading}
            leftSection={<IconFileArrowRight />}
            onClick={issueHandler}
          >
            Issue
          </Button>
        ) : (
          <>
            <Button
              variant={hasBeenMailed ? "light" : undefined}
              leftSection={<IconMailFast />}
              loading={mailLoading}
              onClick={mailHandler}
            >
              {hasBeenMailed ? "Remail" : "Mail"}
            </Button>
            <Button
              loading={downloadLoading}
              leftSection={<IconDownload />}
              onClick={downloadHandler}
            >
              Download PDF
            </Button>
            <Button
              loading={printLoading}
              leftSection={<IconPrinter />}
              onClick={printHandler}
            >
              Print
            </Button>
          </>
        )}
        {canCredit && (
          <Button leftSection={<IconFileArrowLeft />} variant="light">
            Credit
          </Button>
        )}
      </DashboardHeader>
      <Group wrap="nowrap" align="stretch">
        <Paper p="2rem">
          <Band
            title={
              <>
                <Title order={3}>Invoice</Title>
                <Button
                  component={Link}
                  size="compact-md"
                  href={`/${invoice.refType}s/${invoice.refId}`}
                  variant="light"
                  rightSection={<IconExternalLink size="1rem" />}
                >
                  {invoice.refType} {invoice.refId}
                </Button>
                <Badge>{invoice.status}</Badge>
              </>
            }
            fh
          >
            <Group align="stretch" justify="space-between" gap="2rem">
              <Stack align="flex-start">
                <div>
                  <p>
                    {t("common.number")}: {invoice.number || invoice.id}
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
                      "DD-MM-YYYY",
                    )}
                  </p>
                  {invoice.dueDate && (
                    <p>
                      {t("entities.invoice.dueDate")}:{" "}
                      {dayjs(invoice.dueDate).format("DD-MM-YYYY")}
                    </p>
                  )}
                </div>
              </Stack>
            </Group>
          </Band>
        </Paper>
        <Paper p="2rem" style={{ flex: 1 }}>
          <Band.Group align="stretch">
            <Band
              title={
                <>
                  <Title order={3}>Customer</Title>
                  <Title order={3}>-</Title>
                  {invoice.customerId ? (
                    <Button
                      component={Link}
                      size="compact-md"
                      href={`/relations/${invoice.customerId}`}
                      variant="light"
                      rightSection={<IconExternalLink size="1rem" />}
                    >
                      {invoice.customerName || invoice.customer?.name}
                    </Button>
                  ) : (
                    <p
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {invoice.customerName}
                    </p>
                  )}
                </>
              }
            >
              <Stack>
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.customerStreet || invoice.customer?.street}{" "}
                    {invoice.customerHouseNumber ||
                      invoice.customer?.houseNumber}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.customerPostalCode || invoice.customer?.postalCode}{" "}
                    {invoice.customerCity || invoice.customer?.city}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.customerRegion || invoice.customer?.region}
                    {" - "}
                    {t(
                      `constants.countries.${
                        invoice.customerCountry || invoice.customer?.country
                      }`,
                    )}
                  </p>
                </div>
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    Email address:{" "}
                    {invoice.customerEmailAddress ||
                      invoice.customer?.emailAddress}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    Phone number:{" "}
                    {invoice.customerPhoneNumber ||
                      invoice.customer?.phoneNumber}
                  </p>
                </div>
                {(customerVatNumber || customerCocNumber) && (
                  <div>
                    {customerVatNumber && (
                      <p style={{ whiteSpace: "nowrap" }}>
                        VAT number: {customerVatNumber}
                      </p>
                    )}
                    {customerCocNumber && (
                      <p style={{ whiteSpace: "nowrap" }}>
                        CoC number: {customerCocNumber}
                      </p>
                    )}
                  </div>
                )}
              </Stack>
            </Band>
            <Band
              title={
                <>
                  <Title order={3}>Your details</Title>
                  <Title order={3}>-</Title>
                  {invoice.customerId ? (
                    <Button
                      component={Link}
                      size="compact-md"
                      href={`/properties/${invoice.companyId}`}
                      variant="light"
                      rightSection={<IconExternalLink size="1rem" />}
                    >
                      {invoice.companyName || invoice.company?.name}
                    </Button>
                  ) : (
                    <p
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {invoice.companyName}
                    </p>
                  )}
                </>
              }
            >
              <Stack>
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.companyStreet || invoice.company?.street}{" "}
                    {invoice.companyHouseNumber || invoice.company?.houseNumber}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.companyPostalCode || invoice.company?.postalCode}{" "}
                    {invoice.companyCity || invoice.company?.city}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.companyRegion || invoice.company?.region}
                    {" - "}
                    {t(
                      `constants.countries.${
                        invoice.companyCountry || invoice.company?.country
                      }`,
                    )}
                  </p>
                </div>
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    Email address:{" "}
                    {invoice.companyEmailAddress ||
                      invoice.company?.emailAddress}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    Phone number:{" "}
                    {invoice.companyPhoneNumber || invoice.company?.phoneNumber}
                  </p>
                </div>
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    VAT number:{" "}
                    {invoice.companyVatNumber || invoice.company?.vatNumber}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    CoC number:{" "}
                    {invoice.companyCocNumber || invoice.company?.cocNumber}
                  </p>
                </div>
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    IBAN: {invoice.companyIban || invoice.company?.iban}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    BIC/SWIFT:{" "}
                    {invoice.companySwiftBic || invoice.company?.swiftBic}
                  </p>
                </div>
              </Stack>
            </Band>
          </Band.Group>
        </Paper>
        <Paper p="2rem">
          <Band title={<Title order={3}>Timeline</Title>} fh>
            <ScrollArea h={271} type="always" offsetScrollbars>
              <Timeline
                active={invoice.events.length}
                bulletSize="2rem"
                lineWidth={3}
              >
                {invoice.events
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                  .map(
                    ({ id, type, createdAt, createdById, refType, refId }) => {
                      const { IconComponent, title } =
                        INVOICE_EVENT_TYPE_META[type];

                      return (
                        <Timeline.Item
                          bullet={<IconComponent />}
                          title={
                            refType && refId ? (
                              <Group gap="xs">
                                {t(title)}
                                <Button
                                  size="compact-sm"
                                  component={Link}
                                  href={`/invoices/${refId}`}
                                  variant="light"
                                >
                                  <IconExternalLink size="1rem" />
                                </Button>
                              </Group>
                            ) : (
                              t(title)
                            )
                          }
                          key={id}
                        >
                          <Text size="sm" c="dimmed">
                            {"At "}
                            {dayjs(createdAt).format("DD-MM-YYYY HH:mm")}
                          </Text>
                          {createdById && (
                            <Text size="xs" mt={4}>
                              {"By "}
                              <Link href={`/relations/${createdById}`}>
                                Relation {createdById}
                              </Link>
                            </Text>
                          )}
                        </Timeline.Item>
                      );
                    },
                  )}
                <Timeline.Item
                  bullet={<IconPlus size="1.3rem" />}
                  title="Created"
                >
                  <Text size="sm" c="dimmed">
                    {"At "}
                    {dayjs(invoice.createdAt).format("DD-MM-YYYY HH:mm")}
                  </Text>
                  {invoice.createdById && (
                    <Text size="xs" mt={4}>
                      {"by "}
                      <Link href={`/relations/${invoice.createdById}`}>
                        Relation {invoice.createdById}
                      </Link>
                    </Text>
                  )}
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
                      {dayjs(invoice.creditedAt).format("DD-MM-YYYY")}
                    </Text>
                  </Timeline.Item>
                )}
              </Timeline>
            </ScrollArea>
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
