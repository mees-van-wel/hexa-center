"use client";

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
import { useException } from "@/hooks/useException";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CustomerCreateInputSchema,
  CustomerCreateSchema,
} from "@/schemas/customer";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconUserDollar } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();

  const formMethods = useForm<CustomerCreateInputSchema>({
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
  const t = useTranslation();
  const { handleJsonResult } = useException();

  const { control, handleSubmit, setError } =
    useFormContext<CustomerCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<CustomerCreateInputSchema> = async (
    values,
  ) => {
    try {
      const response = await createCustomer.mutate(values);

      notifications.show({
        message: t("entities.customer.createdNotification"),
        color: "green",
      });

      router.push(`/customers/${response.id}`);
    } catch (error) {
      const errorResult = handleJsonResult(
        error,
        t("entities.room.singularName"),
      );

      if (errorResult?.error)
        setError(errorResult?.column, { message: errorResult.error });
    }
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
