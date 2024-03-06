"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

import { PropertyForm } from "@/components/entities/property/PropertyForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  PropertyCreateInputSchema,
  PropertyCreateSchema,
} from "@/schemas/property";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBuilding, IconDeviceFloppy } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();
  const router = useRouter();
  const createProperty = useMutation("property", "create");

  const formMethods = useForm<PropertyCreateInputSchema>({
    resolver: valibotResolver(PropertyCreateSchema),
    defaultValues: {
      name: "",
      emailAddress: "",
      phoneNumber: "",
      street: "",
      houseNumber: "",
      postalCode: "",
      city: "",
      region: "",
      country: null,
    },
  });

  const { handleSubmit, formState } = formMethods;

  const onSubmit = async (values: PropertyCreateInputSchema) => {
    const response = await createProperty.mutate(values);
    notifications.show({
      message: t("entities.property.createdNotification"),
      color: "green",
    });
    router.push(`/properties/${response.id}`);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/properties"
            title={[
              {
                icon: <IconBuilding />,
                label: t("dashboardLayout.properties"),
                href: "/properties",
              },
              { label: t("common.new") },
            ]}
          >
            <Button
              type="submit"
              leftSection={<IconDeviceFloppy />}
              disabled={!formState.isDirty}
            >
              {t("common.save")}
            </Button>
          </DashboardHeader>
          <PropertyForm />
        </Stack>
      </form>
    </FormProvider>
  );
}
