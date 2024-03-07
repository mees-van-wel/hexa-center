"use client";

import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import { RoomInputCreateSchema, RoomInputUpdateSchema } from "@/schemas/room";
import { NumberInput, Paper, Stack, TextInput } from "@mantine/core";
import { IconCurrencyEuro } from "@tabler/icons-react";

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
              label={t("entities.room.keys.price")}
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
