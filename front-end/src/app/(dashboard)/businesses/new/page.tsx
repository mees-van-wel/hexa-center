"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBuilding, IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { BusinessForm } from "@/components/entities/business/BusinessForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BusinessCreateInputSchema,
  BusinessCreateSchema,
} from "@/schemas/business";

export default function Page() {
  const t = useTranslation();

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
      // @ts-ignore Fix this
      country: null,
      cocNumber: "",
      vatId: "",
      iban: "",
      swiftBic: "",
    },
  });

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
            { label: t("common.new") },
          ]}
        >
          <SaveButton />
        </DashboardHeader>
        <BusinessForm />
      </Stack>
    </FormProvider>
  );
}

const SaveButton = () => {
  const createBusiness = useMutation("business", "create");
  const router = useRouter();
  const memory = useMemory();
  const t = useTranslation();

  const { control, handleSubmit } = useFormContext<BusinessCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<BusinessCreateInputSchema> = async (
    values,
  ) => {
    const response = await createBusiness.mutate(values);

    memory.write(response, [
      {
        scope: "business",
        procedure: "get",
        params: response.id,
      },
      {
        scope: "business",
        procedure: "list",
        as: ({ current, result }) =>
          current ? [...current, result] : undefined,
      },
    ]);

    notifications.show({
      message: t("entities.company.createdNotification"),
      color: "green",
    });

    router.push(`/businesses/${response.id}`);
  };

  return (
    <Button
      onClick={handleSubmit(submitHandler)}
      leftSection={<IconDeviceFloppy />}
      disabled={!isDirty}
      loading={createBusiness.loading}
    >
      {t("common.save")}
    </Button>
  );
};
