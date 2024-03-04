"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useTranslation } from "@/hooks/useTranslation";
import {
  PropertyCreateInputSchema,
  PropertyUpdateInputSchema,
} from "@/schemas/property";
import { Group, Paper, Stack, TextInput } from "@mantine/core";

type PropertyFormProps = {
  disabled?: boolean;
};

export const PropertyForm = ({ disabled }: PropertyFormProps) => {
  const t = useTranslation();
  const { register, control, formState } = useFormContext<
    PropertyCreateInputSchema | PropertyUpdateInputSchema
  >();

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <TextInput
            {...register("name")}
            label={t("propertiesPage.name")}
            error={formState.errors.name?.message}
            disabled={disabled}
            required
          />
          <TextInput
            {...register("emailAddress")}
            label={t("propertiesPage.email")}
            error={formState.errors.emailAddress?.message}
            type="email"
            disabled={disabled}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                {...field}
                label={t("propertiesPage.phoneNumber")}
                error={error?.message}
                disabled={disabled}
              />
            )}
          />
        </Group>
        <Address disabled={disabled} />
      </Stack>
    </Paper>
  );
};
