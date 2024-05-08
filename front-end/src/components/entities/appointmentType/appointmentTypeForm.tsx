"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import {
  AppointmentTypeCreateInputSchema,
  AppointmentTypeUpdateInputSchema,
} from "@/schemas/appointmentType";
import {
  ColorInput,
  Group,
  Paper,
  Stack,
  Switch,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";

type AppointmentTypeFormProps = {
  disabled?: boolean;
};

export const AppointmentTypeForm = ({ disabled }: AppointmentTypeFormProps) => {
  const t = useTranslation();
  const { register, control, formState } = useFormContext<
    AppointmentTypeCreateInputSchema | AppointmentTypeUpdateInputSchema
  >();
  const [editMode, setEditMode] = useState(false);
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
        <Tooltip
          label="Disable to view time, enable to set to edit mode"
          refProp="rootRef"
        >
          <Switch
            label="Edit mode"
            onChange={(event) => setEditMode(event.currentTarget.checked)}
          />
        </Tooltip>
        <Controller
          name="appointmentDuration"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TimeInput
              {...field}
              value={
                editMode
                  ? dayjs.duration(field.value).format("HH:mm")
                  : control._defaultValues.appointmentDuration
              }
              onChange={(event) => {
                const time = event.target.value;
                const isoValue = time
                  ? dayjs
                      .duration(
                        `PT${time.split(":")[0]}H${time.split(":")[1]}M`,
                      )
                      .toISOString()
                  : null;
                field.onChange(isoValue);
                setEditMode(false);
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
