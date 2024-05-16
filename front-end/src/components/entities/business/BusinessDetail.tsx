"use client";

import { useMemo, useState } from "react";
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
import { useException } from "@/hooks/useException";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BusinessUpdateInputSchema,
  BusinessUpdateSchema,
} from "@/schemas/business";
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

import { BusinessForm } from "./BusinessForm";

type BusinessPageProps = {
  business: RouterOutput["business"]["get"];
};

export const BusinessDetail = ({ business }: BusinessPageProps) => {
  const t = useTranslation();
  const router = useRouter();
  const deleteBusiness = useMutation("business", "delete");

  const formMethods = useForm<BusinessUpdateInputSchema>({
    defaultValues: business,
    resolver: valibotResolver(BusinessUpdateSchema),
  });

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteBusiness.mutate(business.id);

        notifications.show({
          message: t("entities.company.deletedNotification"),
          color: "green",
        });

        router.push("/businesses");
      },
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/businesses"
          title={[
            {
              icon: <IconBuilding />,
              label: t("entities.company.pluralName"),
              href: "/businesses",
            },
            { label: business.name },
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
        <BusinessForm />
        <Metadata />
      </Stack>
    </FormProvider>
  );
};

const SaveBadge = () => {
  const updateBusiness = useMutation("business", "update");
  const t = useTranslation();
  const { handleJsonResult } = useException();

  const { control, getValues, reset, setError } =
    useFormContext<BusinessUpdateInputSchema>();
  const { isDirty, errors } = useFormState({ control });
  const isError = useMemo(() => !!Object.keys(errors).length, [errors]);
  const [badgeError, setBadgeError] = useState(false);

  useMemo(() => setBadgeError(false), [isDirty]);

  useAutosave(control, async (values) => {
    try {
      const updatedBusiness = await updateBusiness.mutate({
        ...values,
        id: getValues("id"),
      });

      reset(updatedBusiness);
    } catch (error) {
      const errorResult = handleJsonResult(
        error,
        t("entities.company.singularName"),
      );

      if (errorResult?.error) {
        setBadgeError(true);
        setError(errorResult?.column, { message: errorResult.error });
      } else if (!errorResult?.success) {
        reset();
      }
    }
  });

  return (
    <Badge
      size="lg"
      color={
        isError || (badgeError && isDirty)
          ? "red"
          : isDirty || updateBusiness.loading
            ? "orange"
            : "green"
      }
      leftSection={
        isError || (badgeError && isDirty) ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateBusiness.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError || (badgeError && isDirty)
        ? t("common.error")
        : isDirty || updateBusiness.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
