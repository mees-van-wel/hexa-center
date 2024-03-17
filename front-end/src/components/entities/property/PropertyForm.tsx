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
            label={t("common.name")}
            error={formState.errors.name?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("email")}
            label={t("common.email")}
            error={formState.errors.email?.message}
            type="email"
            disabled={disabled}
            withAsterisk
          />
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                {...field}
                label={t("common.phone")}
                error={error?.message}
                disabled={disabled}
                withAsterisk
              />
            )}
          />
        </Group>
        <Address disabled={disabled} required />
        <Group align="end">
          <TextInput
            {...register("vatId")}
            label={t("entities.property.vatId")}
            error={formState.errors.vatId?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("cocNumber")}
            label={t("entities.property.cocNumber")}
            error={formState.errors.cocNumber?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("iban")}
            label={t("entities.property.iban")}
            error={formState.errors.iban?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("swiftBic")}
            label={t("entities.property.swiftBic")}
            error={formState.errors.swiftBic?.message}
            disabled={disabled}
            withAsterisk
          />
        </Group>
      </Stack>
    </Paper>
  );
};
