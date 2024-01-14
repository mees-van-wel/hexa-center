"use client";

import { useRouter } from "next/navigation";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { UserForm } from "@/components/pages/user/UserForm";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserCreateInputSchema, UserCreateSchema } from "@/schemas/user";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconUsers } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();
  const createUser = useMutation("user", "create");
  const router = useRouter();

  const formMethods = useForm<UserCreateInputSchema>({
    resolver: valibotResolver(UserCreateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      street: "",
      houseNumber: "",
      postalCode: "",
      city: "",
      region: "",
      country: null,
      dateOfBirth: null,
      sex: null,
    },
  });

  const submitHandler: SubmitHandler<UserCreateInputSchema> = async (
    values,
  ) => {
    const response = await createUser.mutate(values);

    notifications.show({
      message: t("usersPage.createdNotification"),
      color: "green",
    });

    router.push(`/users/${response.id}`);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submitHandler)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/users"
            title={[
              {
                icon: <IconUsers />,
                label: t("dashboardLayout.users"),
                href: "/users",
              },
              { label: t("common.new") },
            ]}
          >
            <SaveButton loading={createUser.loading} />
          </DashboardHeader>
          <UserForm />
        </Stack>
      </form>
    </FormProvider>
  );
}

const SaveButton = ({ loading }: { loading: boolean }) => {
  const t = useTranslation();

  const { control } = useFormContext<UserCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  return (
    <Button
      type="submit"
      leftSection={<IconDeviceFloppy />}
      disabled={!isDirty}
      loading={loading}
    >
      {t("common.save")}
    </Button>
  );
};
