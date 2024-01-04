"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useTranslation } from "@/hooks/useTranslation";
import { UserCreateInputSchema, UserUpdateInputSchema } from "@/schemas/user";
import { Avatar, Group, Paper, Stack, TextInput } from "@mantine/core";

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
      </Stack>
    </Paper>
  );
};
