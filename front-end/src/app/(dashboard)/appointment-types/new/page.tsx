"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  AppointmentTypeCreateInputSchema,
  AppointmentTypeCreateSchema,
  AppointmentTypeDefaultsSchema,
} from "@shared/schemas/appointmentType";
import { IconCalendarStats, IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { AppointmentTypeForm } from "@/components/entities/appointmentType/AppointmentTypeForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";

export default function Page() {
  const t = useTranslation();

  const formMethods = useForm<AppointmentTypeDefaultsSchema>({
    resolver: valibotResolver(AppointmentTypeCreateSchema),
    defaultValues: {
      name: "",
      color: "",
      appointmentDuration: "",
      appointmentDescription: "",
    },
  });

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/appointment-types"
          title={[
            {
              icon: <IconCalendarStats />,
              label: t("entities.appointmentType.pluralName"),
              href: "/appointment-types",
            },
            { label: t("common.new") },
          ]}
        >
          <SaveButton />
        </DashboardHeader>
        <AppointmentTypeForm />
      </Stack>
    </FormProvider>
  );
}

const SaveButton = () => {
  const createAppointmentType = useMutation("appointmentType", "create");
  const router = useRouter();
  const memory = useMemory();
  const t = useTranslation();

  const { control, handleSubmit } =
    useFormContext<AppointmentTypeCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<AppointmentTypeCreateInputSchema> = async (
    values,
  ) => {
    const response = await createAppointmentType.mutate(values);

    memory.write(response, [
      {
        scope: "appointmentType",
        procedure: "get",
        params: response.id,
      },
      {
        scope: "appointmentType",
        procedure: "list",
        as: ({ current, result }) =>
          current ? [...current, result] : undefined,
      },
    ]);

    notifications.show({
      message: t("entities.appointmentType.createdNotification"),
      color: "green",
    });

    router.push(`/appointment-types/${response.id}`);
  };

  return (
    <Button
      onClick={handleSubmit(submitHandler)}
      leftSection={<IconDeviceFloppy />}
      disabled={!isDirty}
      loading={createAppointmentType.loading}
    >
      {t("common.save")}
    </Button>
  );
};
