"use client";

import { Avatar, Group, Paper, Select, Stack, TextInput } from "@mantine/core";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { Loading } from "@/components/common/Loading";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useAuthUser } from "@/contexts/AuthContext";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { CustomerFormShema } from "@/schemas/customer";
import { RouterOutput } from "@/utils/trpc";

export const CustomerForm = () => {
  const authUser = useAuthUser();
  const { getValues } = useFormContext<CustomerFormShema>();

  const businessId = useMemo(() => getValues().businessId, [getValues]);

  const listPaymentTerms = useQuery("paymentTerm", "list");
  const getBusiness = useQuery("business", "get", {
    initialParams: businessId || authUser.businessId,
  });

  if (
    listPaymentTerms.loading ||
    getBusiness.loading ||
    !listPaymentTerms.data ||
    !getBusiness.data
  )
    return <Loading />;

  return (
    <Form paymentTerms={listPaymentTerms.data} business={getBusiness.data} />
  );
};

type FormProps = {
  paymentTerms: RouterOutput["paymentTerm"]["list"];
  business: RouterOutput["business"]["get"];
};

const Form = ({ paymentTerms, business }: FormProps) => {
  const t = useTranslation();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CustomerFormShema>();

  const defaultPaymentTerm = useMemo(
    () => paymentTerms.find(({ id }) => id === business.paymentTermId),
    [business.paymentTermId, paymentTerms],
  );

  const paymentTermOptions = useMemo(
    () =>
      paymentTerms.map(({ id, name }) => ({
        label: name,
        value: id.toString(),
        disabled: id === defaultPaymentTerm?.id,
      })),
    [defaultPaymentTerm?.id, paymentTerms],
  );

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <Avatar size="lg" />
          <TextInput
            {...register("name")}
            label={t("common.name")}
            error={errors.name?.message}
            withAsterisk
          />
          <TextInput
            {...register("email")}
            label={t("common.email")}
            error={errors.email?.message}
            type="email"
          />
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                {...field}
                label={t("common.phone")}
                error={error?.message}
              />
            )}
          />
        </Group>
        <Address
          keyOverrides={{
            addressLineOne: "billingAddressLineOne",
            addressLineTwo: "billingAddressLineTwo",
            postalCode: "billingPostalCode",
            city: "billingCity",
            region: "billingRegion",
            country: "billingCountry",
          }}
          required
        />
        <Group>
          <TextInput
            {...register("vatId")}
            label={t("entities.customer.vatId")}
            error={errors.vatId?.message}
          />
          <TextInput
            {...register("cocNumber")}
            label={t("entities.customer.cocNumber")}
            error={errors.cocNumber?.message}
          />
          <Controller
            name="paymentTermId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                value={field.value?.toString() || ""}
                error={error?.message}
                label={t("entities.customer.paymentTermId")}
                description={
                  defaultPaymentTerm
                    ? `(Standaard: ${defaultPaymentTerm.name})`
                    : undefined
                }
                data={paymentTermOptions}
                onChange={(value) => {
                  field.onChange(value ? parseInt(value) : null);
                }}
                searchable
                clearable
              />
            )}
          />
        </Group>
        <Group>
          <TextInput
            {...register("contactPersonName")}
            label={t("entities.customer.contactPersonName")}
            error={errors.contactPersonName?.message}
          />
          <TextInput
            {...register("contactPersonEmail")}
            label={t("entities.customer.contactPersonEmail")}
            error={errors.contactPersonEmail?.message}
          />
          <Controller
            name="contactPersonPhone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                {...field}
                label={t("entities.customer.contactPersonPhone")}
                error={error?.message}
              />
            )}
          />
        </Group>
      </Stack>
    </Paper>
  );
};
