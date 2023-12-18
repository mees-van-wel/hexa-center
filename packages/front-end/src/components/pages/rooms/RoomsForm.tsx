"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
import { NumberInput, Stack, TextInput } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";
import {
  RoomInputCreateSchema,
  RoomInputUpdateSchema,
} from "@hexa-center/shared/schemas/room";

type RoomFormProps = {
  initialValues?: RouterOutput["room"]["get"];
};

export const RoomsForm = ({ initialValues }: RoomFormProps) => {
  const t = useTranslation();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RoomInputCreateSchema | RoomInputUpdateSchema>();

  return (
    <Stack>
      <TextInput
        {...register("name")}
        error={errors.name?.message}
        label={t("roomsPage.name")}
        defaultValue={initialValues?.name}
      />
      <Controller
        name="price"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <NumberInput
            {...field}
            error={error?.message}
            label={t("roomsPage.price")}
            defaultValue={initialValues?.price}
          />
        )}
      />
    </Stack>
  );
};
