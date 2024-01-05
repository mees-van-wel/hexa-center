"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { Combobox } from "@/components/common/Combobox";
import { PhoneInput } from "@/components/common/PhoneInput";
import { SEX_VALUES } from "@/constants/sexes";
import { useTranslation } from "@/hooks/useTranslation";
import { UserCreateInputSchema, UserUpdateInputSchema } from "@/schemas/user";
import { Avatar, Group, Paper, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

type UserFormProps = {
  disabled?: boolean;
};

export const UserForm = ({ disabled }: UserFormProps) => {
  const t = useTranslation();

  const { register, control, formState } = useFormContext<
    UserCreateInputSchema | UserUpdateInputSchema
  >();

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <Avatar size="lg" />
          <TextInput
            {...register("firstName")}
            label={t("usersPage.firstName")}
            error={formState.errors.firstName?.message}
            disabled={disabled}
          />
          <TextInput
            {...register("lastName")}
            label={t("usersPage.lastName")}
            error={formState.errors.lastName?.message}
            disabled={disabled}
          />
          <TextInput
            {...register("email")}
            label={t("usersPage.email")}
            error={formState.errors.email?.message}
            type="email"
            disabled={disabled}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                {...field}
                label={t("usersPage.phoneNumber")}
                error={error?.message}
                disabled={disabled}
              />
            )}
          />
        </Group>
        <Address disabled={disabled} />
        <Group>
          <DateInput
            label={t("usersPage.dateOfBirth")}
            disabled={disabled}
            clearable
          />
          <Combobox
            label={t("usersPage.sex")}
            data={SEX_VALUES.map((sex) => ({
              label: t(`constants.sexes.${sex}`),
              value: sex,
            }))}
            disabled={disabled}
            clearable
          />
        </Group>
      </Stack>
    </Paper>
  );
};
