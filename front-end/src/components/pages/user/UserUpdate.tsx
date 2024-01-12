"use client";

import { useRef } from "react";
import Link from "next/link";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAuthUser } from "@/contexts/AuthContext";
import { FormProvider } from "@/contexts/FormContext";
import { useForm } from "@/hooks/useForm";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserUpdateSchema } from "@/schemas/user";
import { type RouterOutput } from "@/utils/trpc";
import { Alert, Badge, Button, Loader, Stack } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
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
  const timeoutRef = useRef<NodeJS.Timeout>();
  // const deleteUser = useMutation("user", "delete");
  // const router = useRouter();

  const isSelf = user.id === authUser.id;

  const formMethods = useForm({
    initialValues: user,
    validation: UserUpdateSchema,
  });

  const { values, reset, validate, isDirty, dirtyValues } = formMethods;

  useDidUpdate(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!isDirty) return;

    timeoutRef.current = setTimeout(async () => {
      if (!isDirty) return;

      const success = validate();
      if (!success) return;

      const updatedUser = await updateUser.mutate({
        ...dirtyValues,
        id: user.id,
      });

      reset(updatedUser);
    }, 500);
  }, [values]);

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
          { label: `${values.firstName} ${values.lastName}` },
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
              {isDirty || updateUser.loading
                ? t("common.saving")
                : t("common.saved")}
            </Badge>
          </>
        )}
      </DashboardHeader>
      {isSelf && (
        <Alert
          icon={<IconAlertTriangle />}
          color="orange"
          title="You can't edit yourself here"
        >
          Your own personal details are editable only on the{" "}
          <Link href="/profile">Profile page</Link>.
        </Alert>
      )}
      <FormProvider {...formMethods}>
        <UserForm disabled={isSelf} />
      </FormProvider>
    </Stack>
  );
};
