"use client";

import { NumberInput, Paper, Stack, TextInput } from "@mantine/core";
import {
  RoomInputCreateSchema,
  RoomInputUpdateSchema,
} from "@shared/schemas/room";
import { IconCurrencyEuro } from "@tabler/icons-react";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";

export const RoomForm = () => {
  const t = useTranslation();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RoomInputCreateSchema | RoomInputUpdateSchema>();

  return (
    <Paper p="md">
      <Stack>
        <TextInput
          {...register("name")}
          error={errors.name?.message}
          label={t("common.name")}
          withAsterisk
        />
        <Controller
          name="price"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <NumberInput
              {...field}
              onChange={(test) => {
                field.onChange(test.toString());
              }}
              error={error?.message}
              label={t("entities.room.price")}
              leftSection={<IconCurrencyEuro size="1rem" />}
              decimalScale={2}
              decimalSeparator=","
              fixedDecimalScale
              hideControls
              withAsterisk
            />
          )}
        />
      </Stack>
    </Paper>
  );
};
