"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Metadata } from "@/components/common/Metadata";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAuthUser } from "@/contexts/AuthContext";
import { useAutosave } from "@/hooks/useAutosave";
import { useException } from "@/hooks/useException";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserUpdateInputSchema, UserUpdateSchema } from "@/schemas/user";
import { type RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Alert, Badge, Button, Loader, Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import { UserForm } from "./UserForm";

type UserDetailProps = {
  user: RouterOutput["user"]["get"];
};

export const UserDetail = ({ user }: UserDetailProps) => {
  const deleteUser = useMutation("user", "delete");
  const authUser = useAuthUser();
  const router = useRouter();
  const t = useTranslation();
  const { handleJsonResult } = useException();

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
        try {
          await deleteUser.mutate(user.id);

          notifications.show({
            message: t("entities.user.deletedNotification"),
            color: "green",
          });

          router.push("/users");
        } catch (error) {
          handleJsonResult(error, t("entities.user.singularName"));
        }
      },
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/users"
          title={[
            {
              icon: <IconUsers />,
              label: t("entities.user.pluralName"),
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
          <Paper>
            <Alert
              icon={<IconAlertTriangle />}
              color="orange"
              title={t("entities.user.isSelfAlertTitle")}
            >
              {/* {t("entities.user.isSelfAlertMessage") + " "}
            <Link href="/profile">
              {t("entities.user.isSelfAlertButton")}
            </Link>
            . */}
            </Alert>
          </Paper>
        )}
        <UserForm disabled={isSelf} />
        {!isSelf && <Metadata />}
      </Stack>
    </FormProvider>
  );
};

const SaveBadge = () => {
  const updateUser = useMutation("user", "update");
  const t = useTranslation();
  const { handleJsonResult } = useException();

  const { control, getValues, reset, setError } =
    useFormContext<UserUpdateInputSchema>();
  const { isDirty, errors } = useFormState({ control });
  const isError = useMemo(() => !!Object.keys(errors).length, [errors]);
  const [exceptionError, setExceptionError] = useState(false);

  useMemo(() => setExceptionError(false), [isDirty]);

  useAutosave(control, async (values) => {
    try {
      const updatedUser = await updateUser.mutate({
        ...values,
        id: getValues("id"),
      });

      reset(updatedUser);
    } catch (error) {
      const errorResult = handleJsonResult(
        error,
        t("entities.user.singularName"),
      );

      if (errorResult?.error) {
        setExceptionError(true);
        setError(errorResult?.column, { message: errorResult.error });
      } else if (!errorResult?.success) {
        reset();
      }
    }
  });

  return (
    <Badge
      size="lg"
      color={
        isError || (exceptionError && isDirty)
          ? "red"
          : isDirty || updateUser.loading
            ? "orange"
            : "green"
      }
      leftSection={
        isError || (exceptionError && isDirty) ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateUser.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError || (exceptionError && isDirty)
        ? t("common.error")
        : isDirty || updateUser.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
