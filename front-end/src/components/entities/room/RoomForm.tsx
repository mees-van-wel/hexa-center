"use client";

import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import { NumberInput, Paper, Stack, TextInput } from "@mantine/core";

import {
  RoomInputCreateSchema,
  RoomInputUpdateSchema,
} from "../../../schemas/room";

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
        />
        <Controller
          name="price"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <NumberInput
              {...field}
              error={error?.message}
              label={t("entities.room.keys.price")}
            />
          )}
        />
      </Stack>
    </Paper>
  );
};
