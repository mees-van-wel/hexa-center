"use client";

import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import { RoomInputCreateSchema, RoomInputUpdateSchema } from "@/schemas/room";
import { Group, NumberInput, TextInput } from "@mantine/core";
import { IconCurrencyEuro } from "@tabler/icons-react";

export const RoomForm = () => {
  const t = useTranslation();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RoomInputCreateSchema | RoomInputUpdateSchema>();

  return (
    <Group>
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
            label={t("roomsPage.price")}
            leftSection={<IconCurrencyEuro size="1rem" />}
            decimalScale={2}
            decimalSeparator=","
            fixedDecimalScale
          />
        )}
      />
    </Group>
  );
};
