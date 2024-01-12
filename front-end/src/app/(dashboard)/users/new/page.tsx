"use client";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { UserForm } from "@/components/pages/user/UserForm";
import { FormProvider } from "@/contexts/FormContext";
import { useForm } from "@/hooks/useForm";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { UserCreateInputSchema, UserCreateSchema } from "@/schemas/user";
import { Button, Stack } from "@mantine/core";
import { IconDeviceFloppy, IconUsers } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();
  // const router = useRouter();
  const createUser = useMutation("user", "create");

  const formMethods = useForm<UserCreateInputSchema>({
    validation: UserCreateSchema,
    initialValues: {
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

  const { isDirty, validate } = formMethods;

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
          onClick={async () => {
            const success = validate();
            if (!success) return;

            // const response = await createUser.mutate(values);
            // router.push(`/users/${response.id}`);
          }}
          leftSection={<IconDeviceFloppy />}
          disabled={!isDirty}
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
