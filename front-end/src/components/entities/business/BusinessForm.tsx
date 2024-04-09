"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BusinessCreateInputSchema,
  BusinessUpdateInputSchema,
} from "@/schemas/business";
import { Group, Paper, Stack, TextInput } from "@mantine/core";

type BusinessFormProps = {
  disabled?: boolean;
};

export const BusinessForm = ({ disabled }: BusinessFormProps) => {
  const t = useTranslation();
  const { register, control, formState } = useFormContext<
    BusinessCreateInputSchema | BusinessUpdateInputSchema
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
            label={t("entities.company.vatId")}
            error={formState.errors.vatId?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("cocNumber")}
            label={t("entities.company.cocNumber")}
            error={formState.errors.cocNumber?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("iban")}
            label={t("entities.company.iban")}
            error={formState.errors.iban?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("swiftBic")}
            label={t("entities.company.swiftBic")}
            error={formState.errors.swiftBic?.message}
            disabled={disabled}
            withAsterisk
          />
        </Group>
      </Stack>
    </Paper>
  );
};
