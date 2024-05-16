"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

import { BusinessForm } from "@/components/entities/business/BusinessForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useException } from "@/hooks/useException";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BusinessCreateInputSchema,
  BusinessCreateSchema,
} from "@/schemas/business";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBuilding, IconDeviceFloppy } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();
  const { handleJsonResult } = useException();
  const router = useRouter();
  const createBusiness = useMutation("business", "create");

  const formMethods = useForm<BusinessCreateInputSchema>({
    resolver: valibotResolver(BusinessCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      addressLineOne: "",
      addressLineTwo: "",
      postalCode: "",
      city: "",
      region: "",
      country: null,
      cocNumber: "",
      vatId: "",
      iban: "",
      swiftBic: "",
    },
  });

  const { handleSubmit, formState, setError, reset } = formMethods;

  const onSubmit = async (values: BusinessCreateInputSchema) => {
    try {
      const response = await createBusiness.mutate(values);

      notifications.show({
        message: t("entities.company.createdNotification"),
        color: "green",
      });

      router.push(`/businesses/${response.id}`);
    } catch (error) {
      const errorResult = handleJsonResult(
        error,
        t("entities.company.singularName"),
      );

      if (errorResult?.error)
        setError(errorResult?.column, { message: errorResult.error });
      else if (!errorResult?.success) reset();
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/businesses"
            title={[
              {
                icon: <IconBuilding />,
                label: t("entities.company.pluralName"),
                href: "/businesses",
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
          <BusinessForm />
        </Stack>
      </form>
    </FormProvider>
  );
}
