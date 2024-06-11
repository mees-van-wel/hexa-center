"use client";

import {
  Badge,
  Button,
  Loader,
  Paper,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconSettings,
} from "@tabler/icons-react";
import { useMemo } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Band } from "@/components/common/Band";
import { BandGroup } from "@/components/common/Band/BandGroup";
import { Loading } from "@/components/common/Loading";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAutosave } from "@/hooks/useAutosave";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";

export default function Page() {
  const t = useTranslation();

  const listSettings = useQuery("setting", "list");
  const listLedgerAccounts = useQuery("ledgerAccount", "list");

  if (
    listSettings.loading ||
    listLedgerAccounts.loading ||
    !listSettings.data ||
    !listLedgerAccounts.data
  )
    return <Loading />;

  return (
    <Detail
      settings={listSettings.data}
      ledgerAccounts={listLedgerAccounts.data}
    />
  );
}

type DetailProps = {
  settings: RouterOutput["setting"]["list"];
  ledgerAccounts: RouterOutput["ledgerAccount"]["list"];
};

export const Detail = ({ settings, ledgerAccounts }: DetailProps) => {
  const t = useTranslation();

  const formMethods = useForm({
    defaultValues: settings,
  });

  const { register, control } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          title={[
            { icon: <IconSettings />, label: t("screens.settings.pluralName") },
          ]}
        >
          <SaveBadge />
        </DashboardHeader>
        <Paper p="xl">
          <Stack gap="xl">
            <BandGroup>
              <Band title={t("screens.settings.visual")}>
                <Stack>
                  <TextInput
                    {...register("companyLogoSrc")}
                    label={t("screens.settings.companyLogoSrc")}
                  />
                  <TextInput
                    {...register("invoiceHeaderImageSrc")}
                    label={t("screens.settings.invoiceHeaderImageSrc")}
                  />
                  <TextInput
                    {...register("invoiceFooterImageSrc")}
                    label={t("screens.settings.invoiceFooterImageSrc")}
                  />
                </Stack>
              </Band>
              <Band title={t("screens.settings.email")}>
                <Stack>
                  <TextInput
                    {...register("invoiceEmailTitle")}
                    label={t("screens.settings.invoiceEmailTitle")}
                  />
                  <Textarea
                    {...register("invoiceEmailContent")}
                    label={t("screens.settings.invoiceEmailContent")}
                  />
                </Stack>
              </Band>
            </BandGroup>
            <BandGroup>
              <Band title={t("screens.settings.financial")}>
                <Stack>
                  <Controller
                    name="priceEntryMode"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Select
                        {...field}
                        value={field.value}
                        error={error?.message}
                        label={t("screens.settings.priceEntryMode.name")}
                        data={[
                          {
                            label: t("screens.settings.priceEntryMode.net"),
                            value: "net",
                          },
                          {
                            label: t("screens.settings.priceEntryMode.gross"),
                            value: "gross",
                          },
                        ]}
                        onChange={(value) => {
                          if (value) field.onChange(value);
                        }}
                        searchable
                        allowDeselect={false}
                      />
                    )}
                  />
                  <Controller
                    name="reservationRevenueAccountId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Select
                        {...field}
                        value={field.value?.toString() || ""}
                        error={error?.message}
                        label={t(
                          "screens.settings.reservationRevenueAccountId",
                        )}
                        data={ledgerAccounts.map(({ id, name }) => ({
                          label: name,
                          value: id.toString(),
                        }))}
                        onChange={(value) => {
                          if (value) field.onChange(parseInt(value));
                        }}
                        searchable
                        allowDeselect={false}
                      />
                    )}
                  />
                </Stack>
              </Band>
              <Band title={t("screens.settings.customer")}>
                <Button>
                  {t("screens.settings.defaultCustomerCustomFields")}
                </Button>
              </Band>
            </BandGroup>
          </Stack>
        </Paper>
      </Stack>
    </FormProvider>
  );
};

const SaveBadge = () => {
  const updateSetting = useMutation("setting", "update");
  const t = useTranslation();

  const { control, getValues, reset, setError } = useFormContext();
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
      const updatedSettings = await updateSetting.mutate(values);
      reset(updatedSettings);
    } catch (error) {
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
        isError ? "red" : isDirty || updateSetting.loading ? "orange" : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateSetting.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateSetting.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
