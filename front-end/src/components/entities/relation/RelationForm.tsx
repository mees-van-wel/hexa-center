"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { Combobox } from "@/components/common/Combobox";
import { PhoneInput } from "@/components/common/PhoneInput";
import { SEX_VALUES } from "@/constants/sexes";
import { useTranslation } from "@/hooks/useTranslation";
import {
  RelationCreateInputSchema,
  RelationUpdateInputSchema,
} from "@/schemas/relation";
import { Avatar, Group, Paper, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

type RelationFormProps = {
  disabled?: boolean;
};

export const RelationForm = ({ disabled }: RelationFormProps) => {
  const t = useTranslation();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RelationCreateInputSchema | RelationUpdateInputSchema>();

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <Avatar size="lg" />
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Combobox
                {...field}
                label={t("entities.relation.keys.sex")}
                error={error?.message}
                data={SEX_VALUES.map((sex) => ({
                  label: t(`constants.sexes.${sex}`),
                  value: sex,
                }))}
                disabled={disabled}
                clearable
              />
            )}
          />
          <TextInput
            {...register("name")}
            label={t("entities.relation.keys.name")}
            error={errors.name?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("emailAddress")}
            label={t("entities.relation.keys.emailAddress")}
            error={errors.emailAddress?.message}
            disabled={disabled}
            type="email"
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                {...field}
                label={t("entities.relation.keys.phoneNumber")}
                error={error?.message}
                disabled={disabled}
              />
            )}
          />
        </Group>
        <Address disabled={disabled} />
        <Group>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DateInput
                {...field}
                label={t("entities.relation.keys.dateOfBirth")}
                error={error?.message}
                disabled={disabled}
                clearable
              />
            )}
          />
          <Controller
            name="sex"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Combobox
                {...field}
                label={t("entities.relation.keys.sex")}
                error={error?.message}
                data={SEX_VALUES.map((sex) => ({
                  label: t(`constants.sexes.${sex}`),
                  value: sex,
                }))}
                disabled={disabled}
                clearable
              />
            )}
          />
        </Group>
      </Stack>
    </Paper>
  );
};
