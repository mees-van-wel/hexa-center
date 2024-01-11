"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { UserForm } from "@/components/pages/user/UserForm";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserCreateInputSchema, UserCreateSchema } from "@/schemas/user";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { IconDeviceFloppy, IconUsers } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();
  const router = useRouter();
  const createUser = useMutation("user", "create");

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

  const { formState, getValues } = formMethods;

  const onSubmit = async () => {
    const values = getValues();
    console.log("TRIGGER", values);
    try {
      const response = await createUser.mutate(values);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

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
          { label: t("common.new") },
        ]}
      >
        <Button
          onClick={onSubmit}
          leftSection={<IconDeviceFloppy />}
          disabled={!formState.isDirty}
          loading={createUser.loading}
        >
          {t("common.save")}
        </Button>
      </DashboardHeader>
      <FormProvider {...formMethods}>
        <UserForm />
      </FormProvider>
    </Stack>
  );
}
