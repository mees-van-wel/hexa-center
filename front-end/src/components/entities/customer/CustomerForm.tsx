"use client";

import { Avatar, Group, Paper, Stack, TextInput } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";

import { Address } from "@/components/common/Address";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CustomerCreateInputSchema,
  CustomerUpdateInputSchema,
} from "@/schemas/customer";

type CustomerFormProps = {
  disabled?: boolean;
};

export const CustomerForm = ({ disabled }: CustomerFormProps) => {
  const t = useTranslation();

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CustomerCreateInputSchema | CustomerUpdateInputSchema>();

  return (
    <Paper p="md">
      <Stack>
        <Group align="end">
          <Avatar size="lg" />
          <TextInput
            {...register("name")}
            label={t("common.name")}
            error={errors.name?.message}
            disabled={disabled}
            withAsterisk
          />
          <TextInput
            {...register("email")}
            label={t("common.email")}
            error={errors.email?.message}
            disabled={disabled}
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
                disabled={disabled}
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
          disabled={disabled}
          required
        />
        <Group>
          <TextInput
            {...register("vatId")}
            label={t("entities.customer.vatId")}
            error={errors.vatId?.message}
            disabled={disabled}
          />
          <TextInput
            {...register("cocNumber")}
            label={t("entities.customer.cocNumber")}
            error={errors.cocNumber?.message}
            disabled={disabled}
          />
        </Group>
        <Group>
          <TextInput
            {...register("contactPersonName")}
            label={t("entities.customer.contactPersonName")}
            error={errors.contactPersonName?.message}
            disabled={disabled}
          />
          <TextInput
            {...register("contactPersonEmail")}
            label={t("entities.customer.contactPersonEmail")}
            error={errors.contactPersonEmail?.message}
            disabled={disabled}
          />
          <Controller
            name="contactPersonPhone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                {...field}
                label={t("entities.customer.contactPersonPhone")}
                error={error?.message}
                disabled={disabled}
              />
            )}
          />
        </Group>
      </Stack>
    </Paper>
  );
};
