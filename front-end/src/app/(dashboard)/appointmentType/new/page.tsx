"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

import { AppointmentTypeForm } from "@/components/entities/appointmentType/appointmentTypeForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  AppointmentTypeCreateInputSchema,
  AppointmentTypeCreateSchema,
} from "@/schemas/appointmentType";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCalendarStats, IconDeviceFloppy } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();
  const router = useRouter();
  const createAppointmentType = useMutation("appointmentType", "create");

  const formMethods = useForm<AppointmentTypeCreateInputSchema>({
    resolver: valibotResolver(AppointmentTypeCreateSchema),
    defaultValues: {
      name: "",
      color: "",
      appointmentDuration: "",
      appointmentDescription: "",
    },
  });
  const { handleSubmit, formState } = formMethods;

  const onSubmit = async (values: AppointmentTypeCreateInputSchema) => {
    const response = await createAppointmentType.mutate(values);
    notifications.show({
      message: t("entities.appointmentType.createdNotification"),
      color: "green",
    });
    router.push(`/appointmentType/${response.id}`);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/appointmentType"
            title={[
              {
                icon: <IconCalendarStats />,
                label: t("dashboardLayout.properties"),
                href: "/appointmentType",
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
          <AppointmentTypeForm />
        </Stack>
      </form>
    </FormProvider>
  );
}
