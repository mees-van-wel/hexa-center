"use client";

import { Group, Paper, Select, Stack, TextInput } from "@mantine/core";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { Loading } from "@/components/common/Loading";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { BusinessFormSchema } from "@/schemas/business";
import { RouterOutput } from "@/utils/trpc";

dayjs.extend(duration);

export const BusinessForm = () => {
  const listPaymentTerms = useQuery("paymentTerm", "list");

  if (listPaymentTerms.loading || !listPaymentTerms.data) return <Loading />;

  return <Form paymentTerms={listPaymentTerms.data} />;
};

type FormProps = {
  paymentTerms: RouterOutput["paymentTerm"]["list"];
};

const Form = ({ paymentTerms }: FormProps) => {
  const t = useTranslation();
  const { register, control, formState } = useFormContext<BusinessFormSchema>();

  const paymentTermOptions = useMemo(
    () =>
      paymentTerms.map(({ id, name }) => ({
        label: name,
        value: id.toString(),
      })),
    [paymentTerms],
  );

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <TextInput
            {...register("name")}
            label={t("common.name")}
            error={formState.errors.name?.message}
            withAsterisk
          />
          <TextInput
            {...register("email")}
            label={t("common.email")}
            error={formState.errors.email?.message}
            type="email"
            withAsterisk
          />
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                {...field}
                label={t("common.phone")}
                error={error?.message}
                withAsterisk
              />
            )}
          />
        </Group>
        <Address required />
        <Group align="end">
          <TextInput
            {...register("vatId")}
            label={t("entities.company.vatId")}
            error={formState.errors.vatId?.message}
            withAsterisk
          />
          <TextInput
            {...register("cocNumber")}
            label={t("entities.company.cocNumber")}
            error={formState.errors.cocNumber?.message}
            withAsterisk
          />
          <Controller
            name="paymentTermId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                value={field.value?.toString() || ""}
                error={error?.message}
                label={t("entities.company.paymentTermId")}
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
            {...register("iban")}
            label={t("entities.company.iban")}
            error={formState.errors.iban?.message}
            withAsterisk
          />
          <TextInput
            {...register("swiftBic")}
            label={t("entities.company.swiftBic")}
            error={formState.errors.swiftBic?.message}
            withAsterisk
          />
        </Group>
      </Stack>
    </Paper>
  );
};
