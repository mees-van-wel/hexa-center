"use client";

import { useRouter } from "next/navigation";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { UserForm } from "@/components/entities/user/UserForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserCreateInputSchema, UserCreateSchema } from "@/schemas/user";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconUsers } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();

  const formMethods = useForm<UserCreateInputSchema>({
    resolver: valibotResolver(UserCreateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLineOne: "",
      addressLineTwo: "",
      postalCode: "",
      city: "",
      region: "",
      country: null,
      sex: null,
      birthDate: null,
    },
  });

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
            { label: t("common.new") },
          ]}
        >
          <SaveButton />
        </DashboardHeader>
        <UserForm />
      </Stack>
    </FormProvider>
  );
}

const SaveButton = () => {
  const createUser = useMutation("user", "create");
  const router = useRouter();
  const t = useTranslation();

  const { control, handleSubmit } = useFormContext<UserCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<UserCreateInputSchema> = async (
    values,
  ) => {
    const response = await createUser.mutate(values);

    notifications.show({
      message: t("entities.user.createdNotification"),
      color: "green",
    });

    router.push(`/users/${response.id}`);
  };

  return (
    <Button
      onClick={handleSubmit(submitHandler)}
      leftSection={<IconDeviceFloppy />}
      disabled={!isDirty}
      loading={createUser.loading}
    >
      {t("common.save")}
    </Button>
  );
};