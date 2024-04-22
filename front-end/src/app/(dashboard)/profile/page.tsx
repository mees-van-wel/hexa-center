"use client";

import { useMemo } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Address } from "@/components/common/Address";
import { Combobox } from "@/components/common/Combobox";
import { Sheet } from "@/components/common/Sheet";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { SEX_VALUES } from "@/constants/sexes";
import { AuthState, CurrentUser, useAuthUser } from "@/contexts/AuthContext";
import { useAutosave } from "@/hooks/useAutosave";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserUpdateInputSchema, UserUpdateSchema } from "@/schemas/auth";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  Avatar,
  Badge,
  Group,
  Loader,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck, IconUser } from "@tabler/icons-react";

export default function Profile() {
  const t = useTranslation();
  const {
    auth: { user },
    setAuth,
  } = useAuthUser();

  const formMethods = useForm<UserUpdateInputSchema>({
    defaultValues: user,
    resolver: valibotResolver(UserUpdateSchema),
  });

  const {
    register,
    control,
    formState: { errors },
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          title={[
            { icon: <IconUser />, label: t("dashboardLayout.avatar.profile") },
          ]}
        >
          <SaveBadge user={user} setAuth={setAuth} />
        </DashboardHeader>
        <Paper p="md">
          <Stack>
            <Group align="end">
              <Avatar size="lg" />
              <TextInput
                {...register("firstName")}
                label={t("entities.user.firstName")}
                error={errors.firstName?.message}
                required
              />
              <TextInput
                {...register("lastName")}
                label={t("entities.user.lastName")}
                error={errors.lastName?.message}
                required
              />
              <Controller
                name="birthDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DateInput
                    {...field}
                    label={t("entities.user.birthDate")}
                    error={error?.message}
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
                    label={t("entities.user.sex")}
                    error={error?.message}
                    data={SEX_VALUES.map((sex) => ({
                      label: t(`constants.sexes.${sex}`),
                      value: sex,
                    }))}
                    clearable
                  />
                )}
              />
            </Group>
            <Address />
          </Stack>
        </Paper>
        <Sheet title={t("generic.authentication")}>
          <Stack>
            <Group>
              <p>{t("common.email")}:</p>
              <Badge variant="dot">{user.email}</Badge>
            </Group>
            <Group>
              <p>{t("common.phone")}:</p>
              <Badge variant="dot">{user.phone}</Badge>
            </Group>
          </Stack>
        </Sheet>
      </Stack>
    </FormProvider>
  );
}

type SaveBadgeProps = {
  user: CurrentUser | null;
  setAuth: (auth: AuthState) => any;
};

const SaveBadge = ({ user, setAuth }: SaveBadgeProps) => {
  const updateProfile = useMutation("auth", "updateProfile");
  const t = useTranslation();

  const { control, reset } = useFormContext<UserUpdateInputSchema>();
  const { isDirty, errors } = useFormState({ control });
  const isError = useMemo(() => !!Object.keys(errors).length, [errors]);

  useAutosave(control, async (values) => {
    function isJson(str: string) {
      if (!str) return { success: false, json: undefined };

      try {
        return { success: true, json: JSON.parse(str) };
      } catch (e) {
        return { success: false, json: undefined };
      }
    }

    try {
      const updatedUser = await updateProfile.mutate({
        ...values,
        id: user.id,
      });

      setAuth({
        user: { ...user, ...updatedUser },
      });

      reset({ id: user.id, ...updatedUser });
    } catch (error) {
      // TODO Fix typings
      const { success } = isJson((error as any).message);
      if (!success) {
        notifications.show({
          message: t("common.oops"),
          color: "red",
        });

        reset();

        return;
      }
    }
  });

  return (
    <Badge
      size="lg"
      color={
        isError ? "red" : isDirty || updateProfile.loading ? "orange" : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateProfile.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateProfile.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
