"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Band } from "@/components/common/Band";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ReservationInputCreateSchema,
  ReservationInputUpdateSchema,
} from "@/schemas/reservation";
import { RouterOutput } from "@/utils/trpc";
import {
  Badge,
  Button,
  Card,
  Group,
  Paper,
  Select,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconFileEuro } from "@tabler/icons-react";

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
    <Paper p="md">
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
        <Space />
        <Band title="Invoices">
          <Group>
            <Card shadow="sm" padding="lg" radius="md" withBorder maw={300}>
              <Card.Section
                style={{
                  backgroundColor: "rgb(var(--color-background))",
                  display: "grid",
                  placeContent: "center",
                  maxHeight: 100,
                  overflow: "hidden",
                }}
              >
                <Group p="1rem">
                  <IconFileEuro
                    size="1rem"
                    stroke={1}
                    style={{
                      color: "gray",
                      transform: "rotate(-45deg)",
                    }}
                  />
                  <IconFileEuro
                    size="2rem"
                    stroke={1}
                    style={{
                      color: "gray",
                      transform: "rotate(-22deg)",
                    }}
                  />
                  <IconFileEuro
                    size="5rem"
                    stroke={1}
                    style={{
                      color: "gray",
                      padding: "0.75rem",
                      margin: "0",
                      border: "3px dashed gray",
                      transition: "margin var(--transition)",
                      borderRadius: "100%",
                    }}
                  />
                  <IconFileEuro
                    size="2rem"
                    stroke={1}
                    style={{
                      color: "gray",
                      transform: "rotate(22deg)",
                    }}
                  />
                  <IconFileEuro
                    size="1rem"
                    stroke={1}
                    style={{
                      color: "gray",
                      transform: "rotate(45deg)",
                    }}
                  />
                </Group>
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>Invoice: 20240003</Text>
                <Badge>Issued</Badge>
              </Group>

              <Text size="sm" c="dimmed">
                With Fjord Tours you can explore more of the magical fjord
                landscapes with tours and activities on and around the fjords of
                Norway
              </Text>

              <Button color="blue" fullWidth mt="md" radius="md">
                Book classic tour now
              </Button>
            </Card>
          </Group>
        </Band>
      </Stack>
    </Paper>
  );
};
