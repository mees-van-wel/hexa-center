"use client";

import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import {
  ReservationInputCreateSchema,
  ReservationInputUpdateSchema,
} from "@/schemas/reservation";
import { type RouterOutput } from "@/utils/trpc";
import {
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDidUpdate } from "@mantine/hooks";
import { IconCurrencyEuro } from "@tabler/icons-react";

type ReservationForm = {
  rooms: RouterOutput["room"]["list"];
  customers: RouterOutput["customer"]["list"];
};

export const ReservationForm = ({ rooms, customers }: ReservationForm) => {
  const t = useTranslation();

  const {
    register,
    control,
    formState: { errors },
    watch,
    getFieldState,
    setValue,
  } = useFormContext<
    ReservationInputCreateSchema | ReservationInputUpdateSchema
  >();

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        label: customer.name,
        value: customer.id.toString(),
      })),
    [customers],
  );

  const roomOptions = useMemo(
    () =>
      !rooms.length
        ? [{ value: "no-rooms", label: t("roomsPage.noRooms"), disabled: true }]
        : rooms.map((room) => ({
            label: room.name,
            value: room.id.toString(),
          })),
    [rooms, t],
  );

  const customerId = watch("customerId");

  useDidUpdate(() => {
    if (getFieldState("guestName").isTouched) return;

    const customer = customers.find(({ id }) => id === customerId);
    if (!customer?.contactPersonName) return;

    setValue("guestName", customer.contactPersonName);
  }, [customerId]);

  return (
    <Paper p="md">
      <Stack>
        <Group>
          <Controller
            name="customerId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                value={field.value?.toString() || ""}
                error={error?.message}
                label={t("entities.reservation.customerId")}
                data={customerOptions}
                onChange={(value) => {
                  if (value) field.onChange(parseInt(value));
                }}
                required
                searchable
                allowDeselect={false}
              />
            )}
          />
          <Controller
            name="roomId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                value={field.value?.toString() || ""}
                error={error?.message}
                label={t("entities.reservation.roomId")}
                data={roomOptions}
                onChange={(value) => {
                  if (value) field.onChange(parseInt(value));
                }}
                required
                searchable
                allowDeselect={false}
              />
            )}
          />
        </Group>
        <Group>
          <Controller
            name="startDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DateInput
                {...field}
                required
                error={error?.message}
                label={t("entities.reservation.startDate")}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DateInput
                {...field}
                required
                error={error?.message}
                label={t("entities.reservation.endDate")}
              />
            )}
          />
        </Group>
        <Group>
          <Controller
            name="guestName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextInput
                {...field}
                error={error?.message}
                label={t("entities.reservation.guestName")}
              />
            )}
          />
          <Controller
            name="priceOverride"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <NumberInput
                {...field}
                value={field.value || ""}
                onChange={(value) => {
                  field.onChange(value.toString() || null);
                }}
                error={error?.message}
                label={t("entities.reservation.priceOverride")}
                leftSection={<IconCurrencyEuro size="1rem" />}
                decimalScale={2}
                decimalSeparator=","
                fixedDecimalScale
                hideControls
              />
            )}
          />
        </Group>
        <Group align="flex-start">
          <Textarea
            {...register("reservationNotes")}
            error={errors.reservationNotes?.message}
            label={t("entities.reservation.reservationNotes")}
            autosize
            minRows={2}
            maxRows={6}
          />
          <Textarea
            {...register("invoiceNotes")}
            error={errors.invoiceNotes?.message}
            label={t("entities.reservation.invoiceNotes")}
            autosize
            minRows={2}
            maxRows={6}
          />
        </Group>
      </Stack>
    </Paper>
  );
};
