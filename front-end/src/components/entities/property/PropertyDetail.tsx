"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  PropertyUpdateInputSchema,
  PropertyUpdateSchema,
} from "@/schemas/property";
import { type RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Loader, Stack } from "@mantine/core";
import { useDebouncedValue, useDidUpdate } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconBuilding, IconCheck, IconTrash } from "@tabler/icons-react";

import { PropertyForm } from "./PropertyForm";

type PropertyPageProps = {
  property: RouterOutput["property"]["get"];
};

export const PropertyDetail = ({ property }: PropertyPageProps) => {
  const t = useTranslation();
  const router = useRouter();
  const updateProperty = useMutation("property", "update");
  const deleteProperty = useMutation("property", "delete");

  const formMethods = useForm<PropertyUpdateInputSchema>({
    defaultValues: property,
    resolver: valibotResolver(PropertyUpdateSchema),
  });

  const { reset, getValues, formState } = formMethods;
  const [debounced] = useDebouncedValue(formState.isDirty, 500);

  useDidUpdate(() => {
    if (!formState.isDirty) return;
    const values = getValues();
    updateProperty.mutate(values).then((response) => {
      reset(response);
    });
  }, [debounced]);

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteProperty.mutate(property.id);

        notifications.show({
          message: t("propertiesPage.deletedNotification"),
          color: "green",
        });

        router.push("/properties");
      },
    });
  };

  return (
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
        <Badge
          size="lg"
          color={updateProperty.loading ? "orange" : "green"}
          leftSection={
            updateProperty.loading ? (
              <Loader color="orange" variant="oval" size="1rem" />
            ) : (
              <IconCheck size="1rem" />
            )
          }
          variant="light"
        >
          {updateProperty.loading ? t("common.saving") : t("common.saved")}
        </Badge>
      </DashboardHeader>
      <FormProvider {...formMethods}>
        <PropertyForm />
      </FormProvider>
    </Stack>
  );
};
