"use client";

import { Avatar, Group, Paper, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { Combobox } from "@/components/common/Combobox";
import { PhoneInput } from "@/components/common/PhoneInput";
import { SEX_VALUES } from "@/constants/sexes";
import { useTranslation } from "@/hooks/useTranslation";
import { UserCreateInputSchema, UserUpdateInputSchema } from "@/schemas/user";

type UserFormProps = {
  disabled?: boolean;
};

export const UserForm = ({ disabled }: UserFormProps) => {
  const t = useTranslation();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<UserCreateInputSchema | UserUpdateInputSchema>();

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <Avatar size="lg" />
          <TextInput
            {...register("firstName")}
            label={t("entities.user.firstName")}
            error={errors.firstName?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("lastName")}
            label={t("entities.user.lastName")}
            error={errors.lastName?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("email")}
            label={t("common.email")}
            error={errors.email?.message}
            disabled={disabled}
            type="email"
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
              />
            )}
          />
        </Group>
        <Address disabled={disabled} />
        <Group>
          <Controller
            name="sex"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Combobox
                {...field}
                label={t("entities.user.sex")}
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
          <Controller
            name="birthDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DateInput
                {...field}
                label={t("entities.user.birthDate")}
                error={error?.message}
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
