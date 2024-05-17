"use client";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import {
  AppointmentTypeCreateInputSchema,
  AppointmentTypeUpdateInputSchema,
} from "@/schemas/appointmentType";
import { ColorInput, Group, Paper, Stack, TextInput } from "@mantine/core";
import { TimeInput } from "@mantine/dates";

dayjs.extend(duration);

export const AppointmentTypeForm = () => {
  const t = useTranslation();
  const { register, control, formState } = useFormContext<
    AppointmentTypeCreateInputSchema | AppointmentTypeUpdateInputSchema
  >();

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <TextInput
            {...register("name")}
            label={t("entities.appointmentType.keys.name")}
            error={formState.errors.name?.message}
            required
          />
          <Controller
            name="color"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ColorInput
                {...field}
                error={error?.message}
                label={t("entities.appointmentType.keys.color")}
                required
              />
            )}
          />
        </Group>
        <TimeInput
          {...register("appointmentDuration")}
          label={t("entities.appointmentType.duration")}
          error={formState.errors.appointmentDuration?.message}
        />
        <TextInput
          {...register("appointmentDescription")}
          label={t("entities.appointmentType.appointmentDescription")}
          error={formState.errors.appointmentDescription?.message}
        />
      </Stack>
    </Paper>
  );
};
