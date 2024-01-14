"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAuthUser } from "@/contexts/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserUpdateInputSchema, UserUpdateSchema } from "@/schemas/user";
import { type RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Alert, Badge, Button, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
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

// TODO Fix type errors in user form
// TODO Fix select input search
// TODO Fix hydration errors
export const UserUpdate = ({ user }: UserPageProps) => {
  const deleteUser = useMutation("user", "delete");
  const authUser = useAuthUser();
  const router = useRouter();
  const t = useTranslation();

  const formMethods = useForm({
    defaultValues: user,
    resolver: valibotResolver(UserUpdateSchema),
  });

  const isSelf = user.id === authUser.id;

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteUser.mutate(user.id);

        notifications.show({
          message: t("usersPage.deletedNotification"),
          color: "green",
        });

        router.push("/users");
      },
    });
  };

  return (
    <Stack>
      <FormProvider {...formMethods}>
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
                loading={deleteUser.loading}
              >
                {t("common.delete")}
              </Button>
              <SaveBadge />
            </>
          )}
        </DashboardHeader>
        {isSelf && (
          <Alert
            icon={<IconAlertTriangle />}
            color="orange"
            title={t("usersPage.isSelfAlert.title")}
          >
            {t("usersPage.isSelfAlert.message") + " "}
            <Link href="/profile">{t("usersPage.isSelfAlert.button")}</Link>.
          </Alert>
        )}
        <UserForm disabled={isSelf} />
      </FormProvider>
    </Stack>
  );
};

const SaveBadge = () => {
  const t = useTranslation();

  const updateUser = useMutation("user", "update");

  const { control, getValues, reset } = useFormContext<UserUpdateInputSchema>();
  const { isDirty } = useFormState({ control });

  useDebounce(control, async (values) => {
    if (!isDirty) return;

    // TODO Validation

    const id = getValues("id");
    const updatedUser = await updateUser.mutate({
      ...values,
      id,
    });

    reset(updatedUser);
  });

  return (
    <Badge
      size="lg"
      color={isDirty || updateUser.loading ? "orange" : "green"}
      leftSection={
        isDirty || updateUser.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isDirty || updateUser.loading ? t("common.saving") : t("common.saved")}
    </Badge>
  );
};
