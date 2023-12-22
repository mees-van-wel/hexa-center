"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserUpdateInputSchema, UserUpdateSchema } from "@/schemas/user";
import type { RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Loader, Stack } from "@mantine/core";
import {
  IconCheck,
  IconDeviceFloppy,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import { UserForm } from "./UserForm";

type UserPageProps = {
  user: RouterOutput["user"]["get"];
};

export const User = ({ user }: UserPageProps) => {
  const t = useTranslation();
  const router = useRouter();
  const updateUser = useMutation("user", "update");
  const deleteUser = useMutation("user", "delete");

  const { handleSubmit, reset, formState, ...restFormMethods } =
    useForm<UserUpdateInputSchema>({
      defaultValues: user,
      resolver: valibotResolver(UserUpdateSchema),
    });

  const onSubmit = () => {};

  const deletehandler = () => {};

  return (
    <FormProvider
      reset={reset}
      formState={formState}
      handleSubmit={handleSubmit}
      {...restFormMethods}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/users"
            title={[
              { icon: <IconUsers />, label: "Users" },
              { label: `${user.firstName} ${user.lastName}` },
            ]}
          >
            {formState.isDirty && (
              <Button type="submit" leftSection={<IconDeviceFloppy />}>
                {t("common.save")}
              </Button>
            )}
            <Button
              color="red"
              variant="light"
              onClick={deletehandler}
              leftSection={<IconTrash />}
            >
              {t("common.delete")}
            </Button>
            <Badge
              size="lg"
              color={updateUser.loading ? "orange" : "green"}
              leftSection={
                updateUser.loading ? (
                  <Loader color="orange" variant="oval" size="1rem" />
                ) : (
                  <IconCheck size="1rem" />
                )
              }
              variant="light"
            >
              {updateUser.loading ? t("common.saving") : t("common.saved")}
            </Badge>
          </DashboardHeader>
          <UserForm />
        </Stack>
      </form>
    </FormProvider>
  );
};
