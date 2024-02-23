"use client";

import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import {
  ReservationInputCreateSchema,
  ReservationInputUpdateSchema,
} from "@/schemas/reservation";
import { RouterOutput } from "@/utils/trpc";
import {
  Group,
  Paper,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

type ReservationForm = {
  rooms: RouterOutput["room"]["list"];
  relations: RouterOutput["relation"]["list"];
};

export const ReservationForm = ({ rooms, relations }: ReservationForm) => {
  const t = useTranslation();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<
    ReservationInputCreateSchema | ReservationInputUpdateSchema
  >();

  const roomsOptions =
    rooms.length === 0
      ? [{ value: "no-rooms", label: t("roomsPage.noRooms"), disabled: true }]
      : rooms.map((room) => ({
          label: room.name,
          value: room.id.toString(),
        }));

  return (
    <Paper p={"1rem"}>
      <Stack>
        <Group>
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
                searchable
                error={error?.message}
                label={t("entities.reservation.keys.roomId")}
                data={roomsOptions}
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
                label={t("entities.reservation.keys.customerId")}
                data={relations.map((relation) => ({
                  label: relation.name,
                  value: relation.id.toString(),
                }))}
                onChange={(value) => {
                  onChange(Number(value));
                }}
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
                label={t("entities.reservation.keys.startDate")}
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
                label={t("entities.reservation.keys.endDate")}
              />
            )}
          />
        </Group>
        <Textarea
          {...register("notes")}
          error={errors.notes?.message}
          label={t("entities.reservation.keys.notes")}
        />
        <TextInput
          {...register("guestName")}
          error={errors.guestName?.message}
          label={t("entities.reservation.keys.guestName")}
        />
      </Stack>
    </Paper>
  );
};
