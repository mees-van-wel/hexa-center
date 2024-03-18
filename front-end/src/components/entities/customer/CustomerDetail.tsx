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
  CustomerCreateSchema,
  CustomerUpdateInputSchema,
} from "@/schemas/customer";
import { type RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconTrash,
  IconUserDollar,
} from "@tabler/icons-react";

import { CustomerForm } from "./CustomerForm";

type CustomerDetailProps = {
  customer: RouterOutput["customer"]["get"];
};

export const CustomerDetail = ({ customer }: CustomerDetailProps) => {
  const deleteCustomer = useMutation("customer", "delete");
  const router = useRouter();
  const t = useTranslation();

  const formMethods = useForm({
    defaultValues: customer,
    resolver: valibotResolver(CustomerCreateSchema),
  });

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteCustomer.mutate(customer.id);

        notifications.show({
          message: t("entities.customer.deletedNotification"),
          color: "green",
        });

        router.push("/customers");
      },
    });
  };

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
            { label: customer.name },
          ]}
        >
          <Button
            color="red"
            variant="light"
            onClick={deletehandler}
            leftSection={<IconTrash />}
            loading={deleteCustomer.loading}
          >
            {t("common.delete")}
          </Button>
          <SaveBadge />
        </DashboardHeader>
        <CustomerForm />
        <Metadata />
      </Stack>
    </FormProvider>
  );
};

const SaveBadge = () => {
  const updateCustomer = useMutation("customer", "update");
  const t = useTranslation();

  const { control, getValues, reset, setError } =
    useFormContext<CustomerUpdateInputSchema>();
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
      const updatedCustomer = await updateCustomer.mutate({
        ...values,
        id: getValues("id"),
      });

      reset(updatedCustomer);
    } catch (error) {
      // TODO Fix typings
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
        isError ? "red" : isDirty || updateCustomer.loading ? "orange" : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateCustomer.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateCustomer.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
