"use client";

import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import {
  ReservationInputCreateSchema,
  ReservationInputUpdateSchema,
} from "@/schemas/reservation";
import { RouterOutput } from "@/utils/trpc";
import { Select, Stack, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

type ReservationForm = {
  rooms: RouterOutput["room"]["list"];
  users: RouterOutput["user"]["list"];
};

export const ReservationForm = ({ rooms, users }: ReservationForm) => {
  const t = useTranslation();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<
    ReservationInputCreateSchema | ReservationInputUpdateSchema
  >();

  return (
    <Stack>
      <Controller
        name="roomId"
        control={control}
        render={({
          field: { onChange, value, ...restFields },
          fieldState: { error },
        }) => (
          <Select
            {...restFields}
            value={value?.toString() ?? ""}
            required
            error={error?.message}
            label={t("reservationPage.roomId")}
            data={rooms.map((room) => ({
              label: room.name,
              value: room.id.toString(),
            }))}
            onChange={(value) => {
              onChange(Number(value));
            }}
          />
        )}
      />
      <Controller
        name="customerId"
        control={control}
        render={({
          field: { onChange, value, ...restFields },
          fieldState: { error },
        }) => (
          <Select
            {...restFields}
            value={value?.toString() ?? ""}
            required
            error={error?.message}
            label={t("reservationPage.customerId")}
            data={users.map((user) => ({
              label: `${user.firstName} ${user.lastName}`,
              value: user.id.toString(),
            }))}
            onChange={(value) => {
              onChange(Number(value));
            }}
          />
        )}
      />
      <Controller
        name="startDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DateInput
            {...field}
            required
            error={error?.message}
            label={t("reservationPage.startDate")}
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
            label={t("reservationPage.endDate")}
          />
        )}
      />
      {/* TODO: check props from mantine */}
      <Textarea
        {...register("notes")}
        error={errors.notes?.message}
        label={t("reservationPage.notes")}
      />
      <TextInput
        {...register("guestName")}
        error={errors.guestName?.message}
        label={t("reservationPage.guestName")}
      />
    </Stack>
  );
};
