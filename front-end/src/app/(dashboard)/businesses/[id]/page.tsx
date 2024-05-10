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
import { BusinessForm } from "@/components/entities/business/BusinessForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAutosave } from "@/hooks/useAutosave";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BusinessUpdateInputSchema,
  BusinessUpdateSchema,
} from "@/schemas/business";
import { RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Flex, Loader, Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconBuilding,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";

type PageParams = { params: { id: string } };

export default function Page({ params }: PageParams) {
  const getBusiness = useQuery("business", "get", {
    initialParams: parseInt(params.id),
  });

  if (getBusiness.loading || !getBusiness.data)
    return (
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
        component={Paper}
        p="md"
      >
        <Loader />
      </Flex>
    );

  return <Detail business={getBusiness.data} />;
}

type DetailProps = {
  business: RouterOutput["business"]["get"];
};

const Detail = ({ business }: DetailProps) => {
  const deleteBusiness = useMutation("business", "delete");
  const memory = useMemory();
  const router = useRouter();
  const t = useTranslation();

  const formMethods = useForm({
    defaultValues: business,
    resolver: valibotResolver(BusinessUpdateSchema),
  });

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteBusiness.mutate(business.id);

        memory.evict(business);

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
            loading={deleteBusiness.loading}
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
  const memory = useMemory();
  const t = useTranslation();

  const { control, getValues, reset } =
    useFormContext<BusinessUpdateInputSchema>();
  const { isDirty, errors } = useFormState({ control });
  const isError = useMemo(() => !!Object.keys(errors).length, [errors]);

  useAutosave(control, async (values) => {
    try {
      const updatedBusiness = await updateBusiness.mutate({
        ...values,
        id: getValues("id"),
      });

      memory.update(updatedBusiness);
      reset(updatedBusiness);
    } catch (error) {
      console.warn(error);

      notifications.show({
        message: t("common.oops"),
        color: "red",
      });
    }
  });

  return (
    <Badge
      size="lg"
      color={
        isError ? "red" : isDirty || updateBusiness.loading ? "orange" : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateBusiness.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateBusiness.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
