"use client";

import { Group, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { useTranslation } from "@/hooks/useTranslation";

import { Sheet } from "../Sheet";

type MetadataProps = {
  showDefault?: boolean;
};

export const Metadata = ({ showDefault }: MetadataProps) => {
  const t = useTranslation();

  const { watch, getValues } = useFormContext();

  const updatedAt = watch("updatedAt");

  const { id, createdAt, createdById, updatedById } = useMemo(
    () => getValues(),
    [getValues],
  );

  return (
    <Sheet
      title={t("components.metadata.name")}
      showDefault={showDefault || false}
    >
      <Group>
        <TextInput value={id} label={t("components.metadata.id")} disabled />
        <DateTimePicker
          value={createdAt}
          label={t("components.metadata.createdAt")}
          disabled
        />
        {createdById && (
          <TextInput
            value={createdById}
            label={t("components.metadata.createdBy")}
            disabled
          />
        )}
        <DateTimePicker
          value={updatedAt}
          label={t("components.metadata.updatedAt")}
          disabled
        />
        {updatedById && (
          <TextInput
            value={updatedById}
            label={t("components.metadata.updatedBy")}
            disabled
          />
        )}
      </Group>
    </Sheet>
  );
};
