"use client";

import { Address } from "@/components/common/Address";
import { Combobox } from "@/components/common/Combobox";
import { PhoneInput } from "@/components/common/PhoneInput";
import { SEX_VALUES } from "@/constants/sexes";
import { useFormContext } from "@/hooks/useFormContext";
import { useTranslation } from "@/hooks/useTranslation";
import { UserCreateInputSchema, UserUpdateInputSchema } from "@/schemas/user";
import { Avatar, Group, Paper, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

type UserFormProps = {
  disabled?: boolean;
};

export const UserForm = ({ disabled }: UserFormProps) => {
  const t = useTranslation();

  const { register } = useFormContext<
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
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("lastName")}
            label={t("usersPage.lastName")}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("email")}
            label={t("usersPage.email")}
            disabled={disabled}
            type="email"
          />
          <PhoneInput
            {...register("phoneNumber")}
            label={t("usersPage.phoneNumber")}
            disabled={disabled}
          />
        </Group>
        <Address disabled={disabled} />
        <Group>
          <DateInput
            {...register("dateOfBirth")}
            label={t("usersPage.dateOfBirth")}
            disabled={disabled}
            clearable
          />
          <Combobox
            {...register("sex")}
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
