"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  CustomerCreateInputSchema,
  CustomerCreateSchema,
  CustomerDefaultsSchema,
} from "@shared/schemas/customer";
import { IconDeviceFloppy, IconUserDollar } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { CustomerForm } from "@/components/entities/customer/CustomerForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";

export default function Page() {
  const t = useTranslation();

  const formMethods = useForm<CustomerDefaultsSchema>({
    resolver: valibotResolver(CustomerCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      billingAddressLineOne: "",
      billingAddressLineTwo: "",
      billingPostalCode: "",
      billingCity: "",
      billingRegion: "",
      billingCountry: null,
      cocNumber: "",
      vatId: "",
      contactPersonName: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
    },
  });

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/customers"
          title={[
            {
              icon: <IconUserDollar />,
              label: t("entities.customer.pluralName"),
              href: "/customers",
            },
            { label: t("common.new") },
          ]}
        >
          <SaveButton />
        </DashboardHeader>
        <CustomerForm />
      </Stack>
    </FormProvider>
  );
}

const SaveButton = () => {
  const createCustomer = useMutation("customer", "create");
  const router = useRouter();
  const memory = useMemory();
  const t = useTranslation();

  const { control, handleSubmit } = useFormContext<CustomerCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<CustomerCreateInputSchema> = async (
    values,
  ) => {
    const response = await createCustomer.mutate(values);

    memory.write(response, [
      {
        scope: "customer",
        procedure: "get",
        params: response.id,
      },
      {
        scope: "customer",
        procedure: "list",
        as: ({ current, result }) =>
          current ? [...current, result] : undefined,
      },
    ]);

    notifications.show({
      message: t("entities.customer.createdNotification"),
      color: "green",
    });

    router.push(`/customers/${response.id}`);
  };

  return (
    <Button
      onClick={handleSubmit(submitHandler)}
      leftSection={<IconDeviceFloppy />}
      disabled={!isDirty}
      loading={createCustomer.loading}
    >
      {t("common.save")}
    </Button>
  );
};
