"use client";

import Link from "next/link";
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

// TODO Populate inputs with form errors
// TODO Translate is self alert
// TODO User deletion
// TODO Fix type errors in user form
// TODO Fix date
export const UserUpdate = ({ user }: UserPageProps) => {
  const authUser = useAuthUser();
  const t = useTranslation();

  // const deleteUser = useMutation("user", "delete");
  // const router = useRouter();

  const isSelf = user.id === authUser.id;

  const deletehandler = () => {};

  return (
    <Stack>
      <FormProvider
        {...useForm({
          defaultValues: user,
          resolver: valibotResolver(UserUpdateSchema),
        })}
      >
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
              <SaveBadge />
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
