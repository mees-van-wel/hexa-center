"use client";

import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAuthUser } from "@/contexts/AuthContext";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserUpdateInputSchema, UserUpdateSchema } from "@/schemas/user";
import { type RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Alert, Badge, Button, Loader, Stack } from "@mantine/core";
import { useDebouncedValue, useDidUpdate } from "@mantine/hooks";
import {
  IconAlertTriangle,
  IconCheck,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import { UserForm } from "./UserForm";

type UserPageProps = {
  user: RouterOutput["user"]["get"];
};

export const UserUpdate = ({ user }: UserPageProps) => {
  const t = useTranslation();
  const authUser = useAuthUser();
  const updateUser = useMutation("user", "update");
  // const deleteUser = useMutation("user", "delete");
  // const router = useRouter();

  const isSelf = user.id === authUser.id;

  const formMethods = useForm<UserUpdateInputSchema>({
    defaultValues: user,
    resolver: valibotResolver(UserUpdateSchema),
  });

  const { reset, getValues, formState } = formMethods;

  const [debounced] = useDebouncedValue(formState.isDirty, 500);

  useDidUpdate(() => {
    if (!formState.isDirty) return;

    const values = getValues();

    // TODO FE validation

    updateUser.mutate(values).then((response) => {
      console.log(response);
      reset(response);
    });
  }, [debounced]);

  const deletehandler = () => {};

  return (
    <Stack>
      <DashboardHeader
        backRouteFallback="/users"
        title={[
          {
            icon: <IconUsers />,
            label: t("dashboardLayout.users"),
            href: "/users",
          },
          { label: `${user.firstName} ${user.lastName}` },
        ]}
      >
        {!isSelf && (
          <>
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
          </>
        )}
      </DashboardHeader>
      <Alert
        icon={<IconAlertTriangle />}
        color="orange"
        title="You can't edit yourself here"
      >
        Your own personal details are editable only on the{" "}
        <Link href="/profile">Profile page</Link>.
      </Alert>
      <FormProvider {...formMethods}>
        <UserForm disabled={isSelf} />
      </FormProvider>
    </Stack>
  );
};
