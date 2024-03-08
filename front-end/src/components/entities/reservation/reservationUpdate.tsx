"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Band } from "@/components/common/Band";
import { Metadata } from "@/components/common/Metadata";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAutosave } from "@/hooks/useAutosave";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ReservationInputUpdateSchema,
  ReservationUpdateSchema,
} from "@/schemas/reservation";
import { RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconEdit,
  IconFile,
  IconFileArrowLeft,
  IconFileEuro,
  IconHotelService,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { CreateInvoiceExtraModal } from "./CreateInvoiceExtraModal";
import { EditInvoiceExtraModal } from "./EditInvoiceExtraModal";
import { InvoicePeriodModal } from "./InvoicePeriodModal";
import { overlapDates } from "./ReservationCreate";
import { ReservationForm } from "./ReservationForm";

dayjs.extend(isBetween);

type ReservationProps = {
  reservation: RouterOutput["reservation"]["get"];
  rooms: RouterOutput["room"]["list"];
  relations: RouterOutput["relation"]["list"];
  invoiceExtraTemplates: RouterOutput["invoiceExtra"]["list"];
  reservations: RouterOutput["reservation"]["list"];
};

export const ReservationUpdate = ({
  reservation,
  rooms,
  relations,
  invoiceExtraTemplates,
  reservations,
}: ReservationProps) => {
  const t = useTranslation();
  const router = useRouter();
  const deleteReservation = useMutation("reservation", "delete");
  const invoicePeriod = useMutation("reservation", "invoicePeriod");
  const createInvoiceExtra = useMutation("reservation", "addInvoiceExtra");
  const updateInvoiceExtra = useMutation("reservation", "updateInvoiceExtra");
  const deleteInvoiceExtra = useMutation("invoiceExtra", "deleteInstance");

  const formMethods = useForm<ReservationInputUpdateSchema>({
    defaultValues: {
      ...reservation,
      priceOverride: reservation.priceOverride
        ? parseFloat(reservation.priceOverride)
        : undefined,
    },
    resolver: valibotResolver(ReservationUpdateSchema),
  });

  const invoices = useMemo(
    () =>
      reservation.invoicesJunction.sort(
        (a, b) =>
          b.invoice.createdAt?.getTime() - a.invoice.createdAt?.getTime(),
      ),
    [reservation.invoicesJunction],
  );

  const deleteHandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      children: <div>{t("common.areYouSure")}</div>,
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteReservation.mutate(reservation.id);
        notifications.show({
          message: t("entities.reservation.roomDeleted"),
          color: "green",
        });
        router.push("/reservations");
      },
    });
  };

  const invoicePeriodHandler = async () => {
    const lastInvoicedDate = invoices[0]?.endDate;

    modals.open({
      title: <Title order={3}>Invoice Period</Title>,
      size: "xs",
      children: (
        <InvoicePeriodModal
          minDate={reservation.startDate}
          maxDate={reservation.endDate}
          excludeDate={(date) =>
            invoices.some(({ startDate, endDate, invoice: { type } }) =>
              type === "credit"
                ? false
                : dayjs(date).isBetween(startDate, endDate, "day", "[]"),
            )
          }
          defaultDate={
            lastInvoicedDate
              ? dayjs(lastInvoicedDate).add(1, "day").toDate()
              : reservation.startDate
          }
          onConfirm={async (startDate, endDate) => {
            await invoicePeriod.mutate({
              reservationId: reservation.id,
              startDate,
              endDate,
            });

            router.refresh();

            notifications.show({
              message: "Period successfully Invoiced",
              color: "green",
            });
          }}
        />
      ),
    });
  };

  const createInvoiceExtraHandler = () => {
    modals.open({
      title: <Title order={3}>Add Invoice Extra</Title>,
      // size: "sm",
      children: (
        <CreateInvoiceExtraModal
          templates={invoiceExtraTemplates}
          onConfirm={async (templateId, overrides) => {
            await createInvoiceExtra.mutate({
              reservationId: reservation.id,
              templateId,
              ...overrides,
            });

            router.refresh();

            notifications.show({
              message: "Invoice extra successfully added",
              color: "green",
            });
          }}
        />
      ),
    });
  };

  const editInvoiceExtraHandler = async (id: number) => {
    const invoiceExtra = reservation.invoicesExtrasJunction.find(
      ({ instance }) => instance.id === id,
    );

    if (!invoiceExtra) return;

    modals.open({
      title: <Title order={3}>Edit Invoice Extra</Title>,
      // size: "sm",
      children: (
        <EditInvoiceExtraModal
          currentValues={{
            name: invoiceExtra.instance.name,
            quantity: invoiceExtra.instance.quantity,
            amount: invoiceExtra.instance.amount,
            unit: invoiceExtra.instance.unit,
            vatPercentage: invoiceExtra.instance.vatPercentage,
            cycle: invoiceExtra.cycle,
          }}
          onConfirm={async (values) => {
            await updateInvoiceExtra.mutate({
              reservationId: reservation.id,
              instanceId: invoiceExtra.instance.id,
              ...values,
            });

            router.refresh();

            notifications.show({
              message: "Invoice extra successfully edited",
              color: "green",
            });
          }}
        />
      ),
    });
  };

  const deleteInvoiceExtraHandler = (id: number) => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteInvoiceExtra.mutate(id);

        router.refresh();

        notifications.show({
          message: "Invoice extra successfully deleted",
          color: "green",
        });
      },
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/reservations"
          title={[
            {
              icon: <IconHotelService />,
              label: t("dashboardLayout.reservations"),
              href: "/reservations",
            },
            {
              label: reservation.customer.name,
            },
          ]}
        >
          <Button
            onClick={invoicePeriodHandler}
            leftSection={<IconFileEuro />}
            loading={invoicePeriod.loading}
          >
            Invoice period
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={deleteHandler}
            leftSection={<IconTrash />}
            loading={deleteReservation.loading}
          >
            {t("common.delete")}
          </Button>
          <SaveBadge reservation={reservation} reservations={reservations} />
        </DashboardHeader>
        <ReservationForm rooms={rooms} relations={relations} />
        <Paper p="2rem">
          <Band
            title={
              <>
                <Title order={3}>Invoice Extra&apos;s</Title>
                <Button
                  onClick={createInvoiceExtraHandler}
                  leftSection={<IconPlus />}
                  loading={createInvoiceExtra.loading}
                >
                  Add
                </Button>
              </>
            }
          >
            {!reservation.invoicesExtrasJunction.length ? (
              <p>None added</p>
            ) : (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Actions</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Unit</Table.Th>
                    <Table.Th>Vat percentage</Table.Th>
                    <Table.Th>Cycle</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reservation.invoicesExtrasJunction.map(
                    ({ instance, cycle }) => (
                      <Table.Tr key={instance.id}>
                        <Table.Td>
                          <Group gap="xs">
                            <Button
                              size="compact-md"
                              variant="light"
                              onClick={() => {
                                editInvoiceExtraHandler(instance.id);
                              }}
                            >
                              <IconEdit size="1rem" />
                            </Button>
                            <Button
                              size="compact-md"
                              variant="light"
                              color="red"
                              onClick={() => {
                                deleteInvoiceExtraHandler(instance.id);
                              }}
                            >
                              <IconTrash size="1rem" />
                            </Button>
                          </Group>
                        </Table.Td>
                        <Table.Td>{instance.name}</Table.Td>
                        <Table.Td>{instance.quantity}</Table.Td>
                        <Table.Td>{instance.amount}</Table.Td>
                        <Table.Td>{instance.unit}</Table.Td>
                        <Table.Td>{instance.vatPercentage}%</Table.Td>
                        <Table.Td>{cycle}</Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color={
                              instance.status === "notApplied"
                                ? "red"
                                : instance.status === "partiallyApplied"
                                  ? "orange"
                                  : "green"
                            }
                          >
                            {instance.status}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ),
                  )}
                </Table.Tbody>
              </Table>
            )}
          </Band>
        </Paper>
        {!!invoices.length && (
          <Paper p="2rem">
            <Band title={<Title order={3}>Invoices</Title>}>
              <ScrollArea>
                <Group gap="2rem" wrap="nowrap">
                  {invoices.map(({ invoice, startDate, endDate }) => {
                    const Icon =
                      invoice.type === "credit"
                        ? IconFileArrowLeft
                        : IconFileEuro;

                    const isFinalInvoice = dayjs(reservation.endDate).isSame(
                      endDate,
                    );

                    return (
                      <Card
                        key={invoice.id}
                        shadow="sm"
                        padding="0"
                        radius="md"
                        withBorder
                        maw={300}
                      >
                        <Card.Section
                          style={{
                            backgroundColor: "rgb(var(--color-background))",
                            display: "grid",
                            placeContent: "center",
                            maxHeight: 100,
                            overflow: "hidden",
                          }}
                        >
                          <Group p="1rem" wrap="nowrap">
                            <IconFile
                              size="1rem"
                              stroke={1}
                              style={{
                                color: "gray",
                                transform: "rotate(-45deg)",
                              }}
                            />
                            <IconFile
                              size="2rem"
                              stroke={1}
                              style={{
                                color: "gray",
                                transform: "rotate(-22deg)",
                              }}
                            />
                            <Icon
                              size="5rem"
                              stroke={1}
                              style={{
                                color: "gray",
                                padding: "0.75rem",
                                margin: "0",
                                border: "2px dashed gray",
                                transition: "margin var(--transition)",
                                borderRadius: "100%",
                              }}
                            />
                            <IconFile
                              size="2rem"
                              stroke={1}
                              style={{
                                color: "gray",
                                transform: "rotate(22deg)",
                              }}
                            />
                            <IconFile
                              size="1rem"
                              stroke={1}
                              style={{
                                color: "gray",
                                transform: "rotate(45deg)",
                              }}
                            />
                          </Group>
                        </Card.Section>
                        <Stack my="md" px="md">
                          <Text fw="bold">
                            {invoice.type === "credit"
                              ? "Credit Invoice"
                              : isFinalInvoice
                                ? "Final Invoice"
                                : "Invoice"}
                            : {invoice.number || invoice.id}
                          </Text>
                          <Text size="sm">
                            From: {dayjs(startDate).format("DD-MM-YYYY")}
                            <br />
                            To: {dayjs(endDate).format("DD-MM-YYYY")}
                          </Text>
                        </Stack>
                        <Divider />
                        <Stack my="md" px="md">
                          <Text size="sm" c="dimmed">
                            Invoice date:{" "}
                            {dayjs(invoice.date || invoice.createdAt).format(
                              "DD-MM-YYYY",
                            )}
                            <br />
                            Amount:{" "}
                            {Intl.NumberFormat("nl-NL", {
                              style: "currency",
                              currency: "EUR",
                            }).format(parseFloat(invoice.grossAmount))}
                          </Text>
                        </Stack>
                        <Button
                          fullWidth
                          component={Link}
                          // @ts-ignore Router
                          href={`/invoices/${invoice.id}`}
                          radius={0}
                        >
                          View Details
                        </Button>
                        <Badge
                          variant="light"
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            borderRadius: "0rem",
                            borderBottomRightRadius: "0.5rem",
                          }}
                        >
                          {isFinalInvoice ? "Final" : invoice.type}
                        </Badge>
                        <Badge
                          variant="light"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            borderRadius: "0rem",
                            borderBottomLeftRadius: "0.5rem",
                          }}
                        >
                          {invoice.status}
                        </Badge>
                      </Card>
                    );
                  })}
                </Group>
              </ScrollArea>
            </Band>
          </Paper>
        )}
        <Metadata />
      </Stack>
    </FormProvider>
  );
};

type SaveButtonProps = {
  reservation: RouterOutput["reservation"]["get"];
  reservations: RouterOutput["reservation"]["list"];
};

const SaveBadge = ({ reservation, reservations }: SaveButtonProps) => {
  const updateReservation = useMutation("reservation", "update");
  const t = useTranslation();

  const { control, getValues, reset, setError } =
    useFormContext<ReservationInputUpdateSchema>();
  const { isDirty, errors } = useFormState({ control });
  const isError = useMemo(() => !!Object.keys(errors).length, [errors]);

  useAutosave(control, async (values) => {
    // TODO: check does not work yet
    const overlaps = reservations.some(({ startDate, endDate, roomId }) => {
      if (getValues("roomId") || reservation.roomId !== roomId) return;
      console.log("FDDF");

      return overlapDates(
        getValues("startDate") || reservation.startDate,
        getValues("endDate") || reservation.endDate,
        startDate,
        endDate,
      );
    });

    function isJson(str: string) {
      if (!str) return { success: false, json: undefined };

      try {
        return { success: true, json: JSON.parse(str) };
      } catch (e) {
        return { success: false, json: undefined };
      }
    }

    try {
      if (getValues("startDate")! > getValues("endDate")!) {
        notifications.show({
          message: t("entities.reservation.dateError"),
          color: "red",
        });

        reset();
        return;
      } else if (overlaps) {
        modals.openConfirmModal({
          title: t("common.areYouSure"),
          children: <div>{t("entities.reservation.overlapError")}</div>,
          labels: { confirm: t("common.yes"), cancel: t("common.no") },
          onConfirm: async () => {
            updateHandler(values);
            return;
          },
        });
      }

      updateHandler(values);
      return;
    } catch (error) {
      const { success, json } = isJson((error as any).message);
      if (!success) {
        notifications.show({
          message: t("common.oops"),
          color: "red",
        });

        reset();

        return;
      }

      const { exception, data } = json;

      if (exception === "DB_UNIQUE_CONSTRAINT") {
        setError(data.column, {
          message: `${t("entities.reservation.name.singular")} - ${getValues(
            data.column,
          )} - ${data.column}`,
        });
      }
    }
  });

  const updateHandler = async (values: ReservationInputUpdateSchema) => {
    const updatedReservation = await updateReservation.mutate({
      ...values,
      id: getValues("id"),
    });

    reset({
      ...updatedReservation,
      priceOverride: updatedReservation.priceOverride
        ? parseFloat(updatedReservation.priceOverride)
        : undefined,
    });
  };

  return (
    <Badge
      size="lg"
      color={
        isError
          ? "red"
          : isDirty || updateReservation.loading
            ? "orange"
            : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateReservation.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateReservation.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
