"use client";

import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";
import { Group, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

import { Sheet } from "../Sheet";

type MetadataProps = {
  showDefault?: boolean;
};

export const Metadata = ({ showDefault }: MetadataProps) => {
  const t = useTranslation();

  const { register, control } = useFormContext();

  return (
    <Sheet
      title={t("components.metadata.createdAt")}
      showDefault={showDefault || false}
    >
      <Group>
        <TextInput
          {...register("id")}
          label={t("components.metadata.id")}
          disabled
        />
        <Controller
          name="createdAt"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              label={t("components.metadata.createdAt")}
              disabled
            />
          )}
        />

        <TextInput
          {...register("createdById")}
          label={t("components.metadata.createdBy")}
          disabled
        />
        <Controller
          name="updatedAt"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              label={t("components.metadata.updatedAt")}
              disabled
            />
          )}
        />
        <TextInput
          {...register("updatedById")}
          label={t("components.metadata.updatedBy")}
          disabled
        />
      </Group>
    </Sheet>
  );
};
