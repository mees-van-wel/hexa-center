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
  PropertyUpdateInputSchema,
  PropertyUpdateSchema,
} from "@/schemas/property";
import { type RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconBuilding,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";

import { PropertyForm } from "./PropertyForm";

type PropertyPageProps = {
  property: RouterOutput["property"]["get"];
};

export const PropertyDetail = ({ property }: PropertyPageProps) => {
  const t = useTranslation();
  const router = useRouter();
  const deleteProperty = useMutation("property", "delete");

  const formMethods = useForm<PropertyUpdateInputSchema>({
    defaultValues: property,
    resolver: valibotResolver(PropertyUpdateSchema),
  });

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteProperty.mutate(property.id);

        notifications.show({
          message: t("entities.property.deletedNotification"),
          color: "green",
        });

        router.push("/properties");
      },
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/properties"
          title={[
            {
              icon: <IconBuilding />,
              label: t("dashboardLayout.properties"),
              href: "/properties",
            },
            { label: property.name },
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
        <PropertyForm />
        <Metadata />
      </Stack>
    </FormProvider>
  );
};

const SaveBadge = () => {
  const updateProperty = useMutation("property", "update");
  const t = useTranslation();

  const { control, getValues, reset, setError } =
    useFormContext<PropertyUpdateInputSchema>();
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
      const updatedProperty = await updateProperty.mutate({
        ...values,
        id: getValues("id"),
      });

      reset(updatedProperty);
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
          message: `${t("entities.property.singularName")} - ${getValues(
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
        isError ? "red" : isDirty || updateProperty.loading ? "orange" : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateProperty.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateProperty.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
