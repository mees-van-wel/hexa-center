"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Metadata } from "@/components/common/Metadata";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAutosave } from "@/hooks/useAutosave";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  AppointmentTypeUpdateInputSchema,
  AppointmentTypeUpdateSchema,
} from "@/schemas/appointmentType";
import { RouterOutput } from "@back-end/routes/_app";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCalendarStats,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";

import { AppointmentTypeForm } from "./appointmentTypeForm";

type AppointmentTypePageProps = {
  appointmentType: RouterOutput["appointmentType"]["get"];
};

export const AppointmentTypeDetail = ({
  appointmentType,
}: AppointmentTypePageProps) => {
  const t = useTranslation();
  const router = useRouter();
  const deleteAppointmentType = useMutation("appointmentType", "delete");

  const formMethods = useForm<AppointmentTypeUpdateInputSchema>({
    defaultValues: appointmentType,
    resolver: valibotResolver(AppointmentTypeUpdateSchema),
  });

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteAppointmentType.mutate(appointmentType.id);

        notifications.show({
          message: t("entities.appointmentType.deletedNotification"),
          color: "green",
        });

        router.push("/appointmentTypes");
      },
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/appointmentTypes"
          title={[
            {
              icon: <IconCalendarStats />,
              label: t("dashboardLayout.appointmentTypes"),
              href: "/appointmentTypes",
            },
            { label: appointmentType.name },
          ]}
        >
          <Button
            color="red"
            variant="light"
            onClick={deletehandler}
            leftSection={<IconTrash />}
          >
            {t("common.delete")}
          </Button>
          <SaveBadge />
        </DashboardHeader>
        <AppointmentTypeForm />
        <Metadata />
      </Stack>
    </FormProvider>
  );
};

const SaveBadge = () => {
  const updateAppointmentType = useMutation("appointmentType", "update");
  const t = useTranslation();

  const { control, getValues, reset, setError } =
    useFormContext<AppointmentTypeUpdateInputSchema>();
  const { isDirty, errors } = useFormState({ control });
  const isError = useMemo(() => !!Object.keys(errors).length, [errors]);

  useAutosave(control, async (values) => {
    function isJson(str: string) {
      if (!str) return { success: false, json: undefined };

      try {
        return { success: true, json: JSON.parse(str) };
      } catch (e) {
        return { success: false, json: undefined };
      }
    }

    try {
      const updatedAppointmentType = await updateAppointmentType.mutate({
        ...values,
        id: getValues("id"),
      });

      reset(updatedAppointmentType);
    } catch (error) {
      const { success, json } = isJson((error as any).message);
      if (!success) {
        notifications.show({
          message: t("common.oops"),
          color: "red",
        });

        reset();

        return;
      }

      const { exception, data } = json;

      if (exception === "DB_UNIQUE_CONSTRAINT") {
        setError(data.column, {
          message: `${t(
            "entities.appointmentType.name.singular",
          )} - ${getValues(data.column)} - ${data.column}`,
        });
      }
    }
  });

  return (
    <Badge
      size="lg"
      color={
        isError
          ? "red"
          : isDirty || updateAppointmentType.loading
            ? "orange"
            : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateAppointmentType.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateAppointmentType.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
