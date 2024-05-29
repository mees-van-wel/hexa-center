"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  AppointmentTypeUpdateInputSchema,
  AppointmentTypeUpdateSchema,
} from "@shared/schemas/appointmentType";
import {
  IconAlertTriangle,
  IconCalendarStats,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Loading } from "@/components/common/Loading";
import { Metadata } from "@/components/common/Metadata";
import { AppointmentTypeForm } from "@/components/entities/appointmentType/AppointmentTypeForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAutosave } from "@/hooks/useAutosave";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";

type PageParams = { params: { id: string } };

export default function Page({ params }: PageParams) {
  const getAppointmentType = useQuery("appointmentType", "get", {
    initialParams: parseInt(params.id),
  });

  if (getAppointmentType.loading || !getAppointmentType.data)
    return <Loading />;

  return <Detail appointmentType={getAppointmentType.data} />;
}

type DetailProps = {
  appointmentType: RouterOutput["appointmentType"]["get"];
};

const Detail = ({ appointmentType }: DetailProps) => {
  const deleteAppointmentType = useMutation("appointmentType", "delete");
  const memory = useMemory();
  const router = useRouter();
  const t = useTranslation();

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

        memory.evict(appointmentType);

        notifications.show({
          message: t("entities.appointmentType.deletedNotification"),
          color: "green",
        });

        router.push("/appointment-types");
      },
    });
  };

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
            { label: appointmentType.name },
          ]}
        >
          <Button
            color="red"
            variant="light"
            onClick={deletehandler}
            leftSection={<IconTrash />}
            loading={deleteAppointmentType.loading}
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
  const memory = useMemory();
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

      memory.update(updatedAppointmentType);
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
          message: `${t("entities.customer.singularName")} - ${getValues(
            data.column,
          )} - ${data.column}`,
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
