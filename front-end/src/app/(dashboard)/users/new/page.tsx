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
import { IconPlus, IconUsers } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();
  const router = useRouter();
  const createUser = useMutation("user", "create");

  const formMethods = useForm<UserCreateInputSchema>({
    resolver: valibotResolver(UserCreateSchema),
  });

  const { handleSubmit } = formMethods;

  const onSubmit = async (values: UserCreateInputSchema) => {
    const response = await createUser.mutate(values);
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
        <Button type="submit" leftSection={<IconPlus />}>
          {t("common.create")}
        </Button>
      </DashboardHeader>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <UserForm />
        </form>
      </FormProvider>
    </Stack>
  );
}
