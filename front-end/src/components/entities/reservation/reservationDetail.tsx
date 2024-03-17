"use client";

import { useEffect, useMemo } from "react";
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
import { IconRotate } from "@tabler/icons-react";

import { AddProductModal } from "./AddProductModal";
import { EditProductModal } from "./EditProductModal";
import { InvoicePeriodModal } from "./InvoicePeriodModal";
import { overlapDates } from "./ReservationCreate";
import { ReservationForm } from "./ReservationForm";

dayjs.extend(isBetween);

type ReservationProps = {
  reservation: RouterOutput["reservation"]["get"];
  rooms: RouterOutput["room"]["list"];
  relations: RouterOutput["relation"]["list"];
  reservations: RouterOutput["reservation"]["list"];
  productTemplates: RouterOutput["product"]["list"];
  ledgerAccounts: RouterOutput["ledgerAccount"]["list"];
};

export const ReservationDetail = ({
  reservation,
  rooms,
  relations,
  reservations,
  productTemplates,
  ledgerAccounts,
}: ReservationProps) => {
  const t = useTranslation();
  const router = useRouter();
  const deleteReservation = useMutation("reservation", "delete");
  const invoicePeriod = useMutation("reservation", "invoicePeriod");
  const addProduct = useMutation("reservation", "addProduct");
  const editProduct = useMutation("reservation", "editProduct");
  const resetProduct = useMutation("reservation", "resetProduct");
  const deleteProductInstance = useMutation("product", "deleteInstance");

  useEffect(() => {
    router.refresh();
  }, []);

  const formMethods = useForm<ReservationInputUpdateSchema>({
    defaultValues: reservation,
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
    const countingInvoices = invoices.filter(
      ({ invoice }) =>
        invoice.status !== "credited" && invoice.type !== "credit",
    );

    const lastInvoicedDate = countingInvoices[0]?.periodEndDate;

    modals.open({
      title: (
        <Title order={3}>{t("entities.reservation.invoicePeriod.name")}</Title>
      ),
      size: "xs",
      children: (
        <InvoicePeriodModal
          minDate={reservation.startDate}
          maxDate={reservation.endDate}
          excludeDate={(date) =>
            countingInvoices.some(({ periodStartDate, periodEndDate }) =>
              dayjs(date).isBetween(
                periodStartDate,
                periodEndDate,
                "day",
                "[]",
              ),
            )
          }
          defaultDate={
            lastInvoicedDate
              ? dayjs(lastInvoicedDate).add(1, "day").toDate()
              : reservation.startDate
          }
          onConfirm={async (periodStartDate, periodEndDate) => {
            await invoicePeriod.mutate({
              reservationId: reservation.id,
              periodStartDate,
              periodEndDate,
            });

            router.refresh();

            notifications.show({
              message: t("entities.reservation.invoicePeriod.succes"),
              color: "green",
            });
          }}
        />
      ),
    });
  };

  const createProductHandler = () => {
    modals.open({
      title: <Title order={3}>{t("entities.reservation.product.add")}</Title>,
      children: (
        <AddProductModal
          templates={productTemplates}
          ledgerAccounts={ledgerAccounts}
          onConfirm={async (templateId, values) => {
            await addProduct.mutate({
              reservationId: reservation.id,
              templateId,
              ...values,
            });

            router.refresh();

            notifications.show({
              message: t("entities.reservation.product.addSucces"),
              color: "green",
            });
          }}
        />
      ),
    });
  };

  const editProductHandler = async (id: number) => {
    const productInstanceJunction = reservation.productInstancesJunction.find(
      ({ productInstance }) => productInstance.id === id,
    );

    if (!productInstanceJunction) return;

    modals.open({
      title: <Title order={3}>{t("entities.reservation.product.edit")}</Title>,
      children: (
        <EditProductModal
          ledgerAccounts={ledgerAccounts}
          currentValues={{
            name: productInstanceJunction.productInstance.name,
            price: productInstanceJunction.productInstance.price,
            vatRate: productInstanceJunction.productInstance.vatRate,
            quantity: productInstanceJunction.quantity,
            cycle: productInstanceJunction.cycle,
            revenueAccountId:
              productInstanceJunction.productInstance.revenueAccountId,
          }}
          onConfirm={async (values) => {
            await editProduct.mutate({
              reservationId: reservation.id,
              instanceId: productInstanceJunction.productInstance.id,
              ...values,
            });

            router.refresh();

            notifications.show({
              message: t("entities.reservation.product.editSucces"),
              color: "green",
            });
          }}
        />
      ),
    });
  };

  const resetProductHandler = (productInstanceId: number) => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await resetProduct.mutate({
          reservationId: reservation.id,
          productInstanceId,
        });

        router.refresh();

        notifications.show({
          message: t("entities.reservation.product.resetSucces"),
          color: "green",
        });
      },
    });
  };

  const deleteProductHandler = (productInstanceId: number) => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteProductInstance.mutate(productInstanceId);

        router.refresh();

        notifications.show({
          message: t("entities.reservation.product.deleted"),
          color: "green",
        });
      },
    });
  };

  const hasFinalInvoice = useMemo(
    () =>
      invoices.some(
        ({ periodEndDate, invoice: { type, status } }) =>
          type !== "credit" &&
          status !== "credited" &&
          dayjs(periodEndDate).isSame(reservation.endDate, "day"),
      ),
    [invoices, reservation.endDate],
  );

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
            disabled={hasFinalInvoice}
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
                <Title order={3}>
                  {t("entities.reservation.product.name")}
                </Title>
                <Button
                  onClick={createProductHandler}
                  leftSection={<IconPlus />}
                  loading={addProduct.loading}
                  disabled={hasFinalInvoice}
                >
                  {t("common.add")}
                </Button>
              </>
            }
          >
            {!reservation.productInstancesJunction.length ? (
              <p>{t("entities.reservation.product.empty")}</p>
            ) : (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>
                      {t("entities.reservation.product.keys.name")}
                    </Table.Th>
                    <Table.Th>
                      {t("entities.reservation.product.keys.price")}
                    </Table.Th>
                    <Table.Th>
                      {t("entities.reservation.product.keys.vatRate")}
                    </Table.Th>
                    <Table.Th>
                      {t("entities.reservation.product.keys.quantity")}
                    </Table.Th>
                    <Table.Th>
                      {t("entities.reservation.product.keys.cycle")}
                    </Table.Th>
                    <Table.Th>
                      {t("entities.reservation.product.keys.status")}
                    </Table.Th>
                    <Table.Th>
                      {t("entities.reservation.product.keys.actions")}
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reservation.productInstancesJunction.map(
                    ({ productInstance, quantity, cycle, status }) => (
                      <Table.Tr key={productInstance.id}>
                        <Table.Td>{productInstance.name}</Table.Td>
                        <Table.Td>
                          {Intl.NumberFormat("nl-NL", {
                            style: "currency",
                            currency: "EUR",
                          }).format(parseFloat(productInstance.price))}
                        </Table.Td>
                        <Table.Td>{productInstance.vatRate}%</Table.Td>
                        <Table.Td>{quantity}x</Table.Td>
                        <Table.Td>{cycle}</Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color={
                              status === "notInvoiced"
                                ? "red"
                                : status === "partiallyInvoiced"
                                  ? "orange"
                                  : "green"
                            }
                          >
                            {status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Button
                              size="compact-md"
                              title="Edit"
                              variant="light"
                              onClick={() => {
                                editProductHandler(productInstance.id);
                              }}
                              disabled={hasFinalInvoice}
                            >
                              <IconEdit size="1rem" />
                            </Button>
                            {status !== "notInvoiced" && (
                              <Button
                                size="compact-md"
                                title="Reset status"
                                variant="light"
                                color="orange"
                                onClick={() => {
                                  resetProductHandler(productInstance.id);
                                }}
                                disabled={hasFinalInvoice}
                              >
                                <IconRotate size="1rem" />
                              </Button>
                            )}
                            <Button
                              size="compact-md"
                              title="Delete"
                              variant="light"
                              color="red"
                              onClick={() => {
                                deleteProductHandler(productInstance.id);
                              }}
                              disabled={hasFinalInvoice}
                            >
                              <IconTrash size="1rem" />
                            </Button>
                          </Group>
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
                <Group gap="2rem" p="md" wrap="nowrap">
                  {invoices.map(
                    ({ invoice, periodStartDate, periodEndDate }) => {
                      const Icon =
                        invoice.type === "credit"
                          ? IconFileArrowLeft
                          : IconFileEuro;

                      const isFinalInvoice = dayjs(reservation.endDate).isSame(
                        periodEndDate,
                      );

                      const color =
                        invoice.type === "credit"
                          ? "orange-8"
                          : invoice.status === "draft"
                            ? "red-8"
                            : isFinalInvoice
                              ? "green-8"
                              : "blue-8";

                      return (
                        <Card
                          key={invoice.id}
                          shadow="sm"
                          padding={0}
                          radius="md"
                          withBorder
                        >
                          <Card.Section
                            style={{
                              backgroundColor: "rgb(var(--color-background))",
                              display: "grid",
                              placeContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            <Group p="1rem" wrap="nowrap">
                              <IconFile
                                size="1rem"
                                stroke={1}
                                style={{
                                  color: `var(--mantine-color-${color})`,
                                  transform: "rotate(-45deg)",
                                }}
                              />
                              <IconFile
                                size="2rem"
                                stroke={1}
                                style={{
                                  color: `var(--mantine-color-${color})`,
                                  transform: "rotate(-22deg)",
                                }}
                              />
                              <Icon
                                size="5rem"
                                stroke={1}
                                style={{
                                  color: "rgb(var(--color-text))",
                                  padding: "0.75rem",
                                  margin: "0",
                                  boxShadow: `inset 0px -8px 16px -8px var(--mantine-color-${color}), 0px 8px 16px -8px var(--mantine-color-${color})`,
                                  borderBottom: `5px ${
                                    invoice.status === "credited"
                                      ? "dashed"
                                      : "solid"
                                  } var(--mantine-color-${color})`,
                                  transition: "margin var(--transition)",
                                  borderRadius: "100%",
                                }}
                              />
                              <IconFile
                                size="2rem"
                                stroke={1}
                                style={{
                                  color: `var(--mantine-color-${color})`,
                                  transform: "rotate(22deg)",
                                }}
                              />
                              <IconFile
                                size="1rem"
                                stroke={1}
                                style={{
                                  color: `var(--mantine-color-${color})`,
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
                              From:{" "}
                              {dayjs(periodStartDate).format("DD-MM-YYYY")}
                              <br />
                              To: {dayjs(periodEndDate).format("DD-MM-YYYY")}
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
                            {invoice.type === "credit"
                              ? "Credit"
                              : isFinalInvoice
                                ? "Final"
                                : invoice.type}
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
                    },
                  )}
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
  const router = useRouter();

  const { control, getValues, reset, setError } =
    useFormContext<ReservationInputUpdateSchema>();
  const { isDirty, errors, dirtyFields } = useFormState({ control });
  const isError = useMemo(() => !!Object.keys(errors).length, [errors]);

  const overlaps = reservations.some(({ id, startDate, endDate, roomId }) => {
    if (
      (getValues("roomId") || reservation.roomId) !== roomId ||
      id === getValues("id")
    )
      return;

    return overlapDates(
      getValues("startDate") || reservation.startDate,
      getValues("endDate") || reservation.endDate,
      startDate,
      endDate,
    );
  });

  useAutosave(control, async (values) => {
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
      }
      if (
        overlaps &&
        (dirtyFields.startDate || dirtyFields.endDate || dirtyFields.roomId)
      ) {
        modals.openConfirmModal({
          title: t("common.areYouSure"),
          children: <div>{t("entities.reservation.overlapError")}</div>,
          labels: { confirm: t("common.yes"), cancel: t("common.no") },
          closeOnClickOutside: false,
          withCloseButton: false,
          onConfirm: () => {
            updateHandler(values);
          },
          onCancel: () => {
            reset();
          },
        });

        return;
      } else {
        updateHandler(values);
        return;
      }
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

  const updateHandler = async (
    values: Omit<ReservationInputUpdateSchema, "id">,
  ) => {
    const updatedReservation = await updateReservation.mutate({
      ...values,
      id: getValues("id"),
    });

    reset(updatedReservation);

    router.refresh();
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
