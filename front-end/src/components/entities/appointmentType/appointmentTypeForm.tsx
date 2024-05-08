"use client";

import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import {
  AppointmentTypeCreateInputSchema,
  AppointmentTypeUpdateInputSchema,
} from "@/schemas/appointmentType";
import { ColorInput, Group, Paper, Stack, TextInput } from "@mantine/core";
import { TimeInput } from "@mantine/dates";

type AppointmentTypeFormProps = {
  disabled?: boolean;
};

export const AppointmentTypeForm = ({ disabled }: AppointmentTypeFormProps) => {
  const t = useTranslation();
  const { register, control, formState } = useFormContext<
    AppointmentTypeCreateInputSchema | AppointmentTypeUpdateInputSchema
  >();
  var duration = require("dayjs/plugin/duration");
  dayjs.extend(duration);

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <TextInput
            {...register("name")}
            label={t("entities.appointmentType.keys.name")}
            error={formState.errors.name?.message}
            disabled={disabled}
            required
          />
          <Controller
            name="color"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ColorInput
                {...field}
                error={error?.message}
                disabled={disabled}
                label={t("entities.appointmentType.keys.color")}
                required
              />
            )}
          />
        </Group>
        <Controller
          name="appointmentDuration"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TimeInput
              {...field}
              value={field.value ? field.value : ""}
              onChange={(event) => {
                field.onChange(event.target.value);
              }}
              label={t("entities.appointmentType.duration")}
              error={error?.message}
            />
          )}
        />
        <TextInput
          {...register("appointmentDescription")}
          label={t("entities.appointmentType.appointmentDescription")}
        />
      </Stack>
    </Paper>
  );
};
