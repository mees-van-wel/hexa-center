"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useTranslation } from "@/hooks/useTranslation";
import { UserCreateInputSchema, UserUpdateInputSchema } from "@/schemas/user";
import { Avatar, Group, Paper, Stack, TextInput } from "@mantine/core";

export const UserForm = () => {
  const t = useTranslation();
  const formMethods = useFormContext<
    UserCreateInputSchema | UserUpdateInputSchema
  >();

  const { register, control, formState } = formMethods;

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <Avatar
            style={{
              flexGrow: 0,
            }}
          />
          <TextInput
            {...register("firstName")}
            label={t("usersPage.firstName")}
            error={formState.errors.firstName?.message}
            style={{
              flexGrow: 1,
            }}
          />
          <TextInput
            {...register("lastName")}
            label={t("usersPage.lastName")}
            error={formState.errors.lastName?.message}
            style={{
              flexGrow: 1,
            }}
          />
          <TextInput
            {...register("email")}
            label={t("usersPage.email")}
            error={formState.errors.email?.message}
            type="email"
            style={{
              flexGrow: 1,
            }}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                {...field}
                label={t("roomsPage.phoneNumber")}
                error={error?.message}
                style={{
                  flexGrow: 1,
                }}
              />
            )}
          />
        </Group>
        <Address form={formMethods} />
      </Stack>
    </Paper>
  );
};
