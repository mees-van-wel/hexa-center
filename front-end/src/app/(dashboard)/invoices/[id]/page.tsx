"use client";

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
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconExternalLink,
  IconFileArrowLeft,
  IconFileArrowRight,
  IconFileEuro,
  IconMailFast,
  IconPlus,
  IconPrinter,
  IconTrash,
} from "@tabler/icons-react";
import { IconDownload } from "@tabler/icons-react";
import dayjs from "dayjs";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Band } from "@/components/common/Band";
import { Loading } from "@/components/common/Loading";
import { IssueModal } from "@/components/entities/invoice/IssueModal";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { CountryKey } from "@/constants/countries";
import { INVOICE_EVENT_TYPE_META } from "@/constants/invoiceEventTypes";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import type { RouterOutput } from "@/utils/trpc";

import styles from "./page.module.scss";

type PageParams = { params: { id: string } };

export default function Page({ params }: PageParams) {
  const getInvoice = useQuery("invoice", "get", {
    initialParams: parseInt(params.id),
  });

  if (getInvoice.loading || !getInvoice.data) return <Loading />;

  return <Detail invoice={getInvoice.data} />;
}

type DetailProps = {
  invoice: RouterOutput["invoice"]["get"];
};

const Detail = ({ invoice }: DetailProps) => {
  const t = useTranslation();
  const issueInvoice = useMutation("invoice", "issue");
  const generatePdf = useMutation("invoice", "generatePdf");
  const mailInvoice = useMutation("invoice", "mail");
  const creditInvoice = useMutation("invoice", "credit");
  const deleteInvoice = useMutation("invoice", "delete");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const router = useRouter();
  const memory = useMemory();

  const issueHandler = async () => {
    const onConfirm = async (issueDate: Date) => {
      try {
        const response = await issueInvoice.mutate({
          invoiceId: invoice.id,
          date: issueDate,
        });

        memory.rawUpdate({
          scope: "invoice",
          procedure: "get",
          params: invoice.id,
          data: response,
        });

        notifications.show({
          message: t("entities.invoice.issuedSucces"),
          color: "green",
        });
      } catch (e) {
        const error = e as Error | undefined;
        notifications.show({
          title: t("entities.invoice.issuedfailed"),
          message: error?.message || "...",
          color: "red",
        });
      }
    };

    modals.open({
      title: t("common.areYouSure"),
      children: <IssueModal onConfirm={onConfirm} />,
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
    else alert(t("entities.invoice.printDocumentAlert"));

    setPrintLoading(false);
  };

  const mailHandler = async () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        try {
          const response = await mailInvoice.mutate(invoice.id);

          memory.rawUpdate({
            scope: "invoice",
            procedure: "get",
            params: invoice.id,
            data: response,
          });

          notifications.show({
            message: t("entities.invoice.mailedSucces"),
            color: "green",
          });
        } catch (e) {
          const error = e as Error | undefined;
          notifications.show({
            title: t("entities.invoice.mailedFailed"),
            message: error?.message || "...",
            color: "red",
          });
        }
      },
    });
  };

  const creditHandler = async () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        try {
          const creditInvoiceId = await creditInvoice.mutate(invoice.id);

          router.push(`/invoices/${creditInvoiceId}`);

          notifications.show({
            message: "Credited successfully",
            color: "green",
          });
        } catch (e) {
          const error = e as Error | undefined;
          notifications.show({
            title: t("entities.invoice.creditSucces"),
            message: error?.message || "...",
            color: "red",
          });
        }
      },
    });
  };

  const deleteHandler = async () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteInvoice.mutate(invoice.id);

        if (invoice.refType === "reservation")
          memory.rawUpdate({
            scope: "reservation",
            procedure: "get",
            params: invoice.refId,
            data: (current) => ({
              ...current,
              invoicesJunction: current.invoicesJunction.filter(
                ({ invoiceId }) => invoiceId !== invoice.id,
              ),
            }),
          });

        router.back();

        notifications.show({
          message: t("entities.invoice.deleted"),
          color: "green",
        });
      },
    });
  };

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

  const customerCocNumber =
    invoice.customerCocNumber || invoice.customer?.cocNumber;
  const customerVatId = invoice.customerVatId || invoice.customer?.vatId;

  const customerCountry =
    invoice.customerBillingCountry || invoice.customer?.billingCountry;

  const companyCountry = invoice.companyCountry || invoice.company?.country;

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
          <>
            <Button
              loading={issueInvoice.loading}
              leftSection={<IconFileArrowRight />}
              onClick={issueHandler}
            >
              {t("entities.invoice.issue")}
            </Button>
            <Button
              color="red"
              variant="light"
              loading={deleteInvoice.loading}
              leftSection={<IconTrash />}
              onClick={deleteHandler}
            >
              {t("common.delete")}
            </Button>
          </>
        ) : (
          <>
            {(invoice.customerEmail || invoice.customer?.email) && (
              <Button
                variant={hasBeenMailed ? "light" : undefined}
                leftSection={<IconMailFast />}
                loading={mailInvoice.loading}
                onClick={mailHandler}
              >
                {hasBeenMailed ? t("common.remail") : t("common.mail")}
              </Button>
            )}
            <Button
              loading={downloadLoading}
              leftSection={<IconDownload />}
              onClick={downloadHandler}
            >
              {t("common.downloadPdf")}
            </Button>
            <Button
              loading={printLoading}
              leftSection={<IconPrinter />}
              onClick={printHandler}
            >
              {t("common.print")}
            </Button>
          </>
        )}
        {canCredit && (
          <Button
            loading={creditInvoice.loading}
            leftSection={<IconFileArrowLeft />}
            onClick={creditHandler}
          >
            {t("entities.invoice.credit")}
          </Button>
        )}
        <Badge
          size="lg"
          color="green"
          leftSection={<IconCheck size="1rem" />}
          variant="light"
        >
          {t("common.saved")}
        </Badge>
      </DashboardHeader>
      <Group align="stretch">
        <Paper p="2rem" style={{ flex: 1 }}>
          <Band
            title={
              <Title order={3}>{t("entities.invoice.singularName")}</Title>
            }
            fh
          >
            <Group align="stretch" justify="space-between" gap="2rem">
              <Stack align="flex-start">
                <Button
                  component={Link}
                  size="compact-md"
                  // TODO remove hardcoded s
                  href={`/${invoice.refType}s/${invoice.refId}` as Route}
                  variant="light"
                  leftSection={<IconExternalLink size="1rem" />}
                >
                  {t(`entities.${invoice.refType}.singularName`)}{" "}
                  {invoice.refId}
                </Button>
                <div>
                  <p>
                    <strong>{t("entities.invoice.type.name")}:</strong>{" "}
                    <Badge variant="light">
                      {t(`entities.invoice.type.${invoice.type}`)}
                    </Badge>
                  </p>
                  <p>
                    <strong>{t("entities.invoice.status.name")}:</strong>{" "}
                    <Badge variant="light">
                      {t(`entities.invoice.status.${invoice.status}`)}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>{t("common.number")}:</strong>{" "}
                    {invoice.number || invoice.id}
                  </p>
                  <p>
                    <strong>{t("entities.invoice.totalGrossAmount")}:</strong>{" "}
                    {Intl.NumberFormat("nl-NL", {
                      style: "currency",
                      currency: "EUR",
                    }).format(parseFloat(invoice.grossAmount))}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>{t("entities.invoice.date")}:</strong>{" "}
                    {dayjs(invoice.date || invoice.createdAt).format(
                      "DD-MM-YYYY",
                    )}
                  </p>
                  {invoice.dueDate && (
                    <p>
                      <strong>{t("entities.invoice.dueDate")}:</strong>{" "}
                      {dayjs(invoice.dueDate).format("DD-MM-YYYY")}
                    </p>
                  )}
                </div>
                {invoice.notes && (
                  <p>
                    <strong>{t("entities.invoice.notes")}:</strong>{" "}
                    {invoice.notes}
                  </p>
                )}
              </Stack>
            </Group>
          </Band>
        </Paper>
        <Paper p="2rem" className={styles.invoiceInfo}>
          <Band.Group>
            <Band
              title={
                <Title order={3}>{t("entities.invoice.customerName")}</Title>
              }
            >
              <Stack align="flex-start">
                {invoice.customerId ? (
                  <Button
                    component={Link}
                    size="compact-md"
                    href={`/customers/${invoice.customerId}` as Route}
                    variant="light"
                    leftSection={<IconExternalLink size="1rem" />}
                  >
                    {invoice.customerName || invoice.customer?.name}
                  </Button>
                ) : (
                  <p style={{ whiteSpace: "nowrap" }}>{invoice.customerName}</p>
                )}
                {invoice.customerBusinessContactPerson && (
                  <p style={{ whiteSpace: "nowrap" }}>
                    Attn: {invoice.customerBusinessContactPerson}
                  </p>
                )}
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.customerBillingAddressLineOne ||
                      invoice.customer?.billingAddressLineOne}
                  </p>
                  {(invoice.customerBillingAddressLineTwo ||
                    invoice.customer?.billingAddressLineTwo) && (
                    <p style={{ whiteSpace: "nowrap" }}>
                      {invoice.customerBillingAddressLineTwo ||
                        invoice.customer?.billingAddressLineTwo}
                    </p>
                  )}
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.customerBillingCity ||
                      invoice.customer?.billingCity}{" "}
                    {invoice.customerBillingRegion ||
                      invoice.customer?.billingRegion}{" "}
                    {invoice.customerBillingPostalCode ||
                      invoice.customer?.billingPostalCode}
                  </p>
                  {customerCountry && (
                    <p style={{ whiteSpace: "nowrap" }}>
                      {t(
                        `constants.countries.${customerCountry as CountryKey}`,
                      )}
                    </p>
                  )}
                </div>
                {(invoice.customerEmail ||
                  invoice.customer?.email ||
                  invoice.customerPhone ||
                  invoice.customer?.phone) && (
                  <div>
                    {(invoice.customerEmail || invoice.customer?.email) && (
                      <p style={{ whiteSpace: "nowrap" }}>
                        {t("common.email")}:{" "}
                        {invoice.customerEmail || invoice.customer?.email}
                      </p>
                    )}
                    {(invoice.customerPhone || invoice.customer?.phone) && (
                      <p style={{ whiteSpace: "nowrap" }}>
                        {t("common.phone")}:{" "}
                        {invoice.customerPhone || invoice.customer?.phone}
                      </p>
                    )}
                  </div>
                )}
                {(customerVatId || customerCocNumber) && (
                  <div>
                    {customerCocNumber && (
                      <p style={{ whiteSpace: "nowrap" }}>
                        {t("entities.customer.cocNumber")}: {customerCocNumber}
                      </p>
                    )}
                    {customerVatId && (
                      <p style={{ whiteSpace: "nowrap" }}>
                        {t("entities.customer.vatId")}: {customerVatId}
                      </p>
                    )}
                  </div>
                )}
              </Stack>
            </Band>
            <Band
              title={<Title order={3}>{t("invoicePage.yourDetails")}</Title>}
            >
              <Stack align="flex-start">
                {invoice.customerId ? (
                  <Button
                    component={Link}
                    size="compact-md"
                    href={`/businesses/${invoice.companyId}` as Route}
                    variant="light"
                    leftSection={<IconExternalLink size="1rem" />}
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
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.companyAddressLineOne ||
                      invoice.company?.addressLineOne}
                  </p>
                  {(invoice.companyAddressLineTwo ||
                    invoice.company?.addressLineTwo) && (
                    <p style={{ whiteSpace: "nowrap" }}>
                      {invoice.companyAddressLineTwo ||
                        invoice.company?.addressLineTwo}
                    </p>
                  )}
                  <p style={{ whiteSpace: "nowrap" }}>
                    {invoice.companyCity || invoice.company?.city}{" "}
                    {invoice.companyRegion || invoice.company?.region}{" "}
                    {invoice.companyPostalCode || invoice.company?.postalCode}
                  </p>
                  {companyCountry && (
                    <p style={{ whiteSpace: "nowrap" }}>
                      {t(`constants.countries.${companyCountry as CountryKey}`)}
                    </p>
                  )}
                </div>
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {t("common.email")}:{" "}
                    {invoice.companyEmail || invoice.company?.email}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {t("common.phone")}:{" "}
                    {invoice.companyPhone || invoice.company?.phone}
                  </p>
                </div>
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {t("entities.customer.vatId")}:{" "}
                    {invoice.companyVatId || invoice.company?.vatId}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {t("entities.customer.cocNumber")}:{" "}
                    {invoice.companyCocNumber || invoice.company?.cocNumber}
                  </p>
                </div>
                <div>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {t("entities.company.iban")}:{" "}
                    {invoice.companyIban || invoice.company?.iban}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    {t("entities.company.swiftBic")}:{" "}
                    {invoice.companySwiftBic || invoice.company?.swiftBic}
                  </p>
                </div>
              </Stack>
            </Band>
          </Band.Group>
        </Paper>
        <Paper p="2rem" style={{ flex: 1 }}>
          <Band title={<Title order={3}>{t("invoicePage.timeline")}</Title>} fh>
            <ScrollArea h={300} type="always" offsetScrollbars>
              <Timeline
                active={invoice.events.length}
                bulletSize="2rem"
                lineWidth={3}
              >
                {invoice.events
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                  .map(
                    ({
                      id,
                      type,
                      createdAt,
                      createdById,
                      createdBy,
                      refType,
                      refId,
                    }) => {
                      const { IconComponent, title, message } =
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
                                  href={`/invoices/${refId}` as Route}
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
                          <Text size="xs" c="dimmed" style={{ maxWidth: 180 }}>
                            {t(message)}
                            {" at "}
                            {dayjs(createdAt).format("DD-MM-YYYY HH:mm")}
                            {createdById && (
                              <>
                                {" by "}
                                <Link href={`/users/${createdById}`}>
                                  {createdBy?.firstName} {createdBy?.lastName}
                                </Link>
                              </>
                            )}
                          </Text>
                        </Timeline.Item>
                      );
                    },
                  )}
                <Timeline.Item
                  bullet={<IconPlus size="1.3rem" />}
                  title="Created"
                >
                  <Text size="xs" c="dimmed" style={{ maxWidth: 200 }}>
                    {"At "}
                    {dayjs(invoice.createdAt).format("DD-MM-YYYY HH:mm")}
                    {invoice.createdById && (
                      <>
                        {" by "}
                        <Link href={`/users/${invoice.createdById}`}>
                          {invoice.createdBy?.firstName}{" "}
                          {invoice.createdBy?.lastName}
                        </Link>
                      </>
                    )}
                  </Text>
                </Timeline.Item>
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
                <Table.Th>{t("common.name")}</Table.Th>
                <Table.Th>{t("invoicePage.lines.unitPrice")}</Table.Th>
                <Table.Th>{t("invoicePage.lines.quantity")}</Table.Th>
                <Table.Th>{t("invoicePage.lines.totalNetAmount")}</Table.Th>
                <Table.Th>{t("invoicePage.lines.vat")}</Table.Th>
                <Table.Th>{t("invoicePage.lines.totalGrossAmount")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {invoice.lines.map(
                ({
                  id,
                  name,
                  unitAmount,
                  quantity,
                  netAmount,
                  vatAmount,
                  vatRate,
                  grossAmount,
                }) => (
                  <Table.Tr key={id}>
                    <Table.Td>{name}</Table.Td>
                    <Table.Td>
                      {Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(parseFloat(unitAmount))}
                    </Table.Td>
                    <Table.Td>{quantity}x</Table.Td>
                    <Table.Td>
                      {Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(parseFloat(netAmount))}
                    </Table.Td>
                    <Table.Td>
                      {vatRate?.toString()
                        ? Intl.NumberFormat("nl-NL", {
                            style: "currency",
                            currency: "EUR",
                          }).format(parseFloat(vatAmount)) + ` (${vatRate}%)`
                        : "Not applicable"}
                    </Table.Td>
                    <Table.Td>
                      {Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(parseFloat(grossAmount))}
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
                >
                  <Text size="1.25rem" fw={700}>
                    {t("common.total")}
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
                  }).format(parseFloat(invoice.netAmount))}
                </Table.Td>
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                >
                  {Intl.NumberFormat("nl-NL", {
                    style: "currency",
                    currency: "EUR",
                  }).format(parseFloat(invoice.vatAmount))}
                </Table.Td>
                <Table.Td
                  style={{
                    paddingTop: "1.5rem",
                  }}
                >
                  {Intl.NumberFormat("nl-NL", {
                    style: "currency",
                    currency: "EUR",
                  }).format(parseFloat(invoice.grossAmount))}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Band>
      </Paper>
    </Stack>
  );
};
