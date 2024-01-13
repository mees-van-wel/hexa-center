"use client";

import { useRouter } from "next/navigation";
import {
  FormProvider,
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
import { IconDeviceFloppy, IconUsers } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();

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
            { label: t("common.new") },
          ]}
        >
          <SaveButton />
        </DashboardHeader>
        <UserForm />
      </FormProvider>
    </Stack>
  );
}

const SaveButton = () => {
  const createUser = useMutation("user", "create");
  const router = useRouter();
  const t = useTranslation();

  const { getValues, control } = useFormContext<UserCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  return (
    <Button
      onClick={async () => {
        // TODO Validation

        const values = getValues();
        const response = await createUser.mutate(values);
        router.push(`/users/${response.id}`);
      }}
      leftSection={<IconDeviceFloppy />}
      disabled={!isDirty}
      loading={createUser.loading}
    >
      {t("common.save")}
    </Button>
  );
};
