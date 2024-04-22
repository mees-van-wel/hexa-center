"use client";

import { useMemo } from "react";
import dayjs from "dayjs";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Sheet } from "@/components/common/Sheet/Sheet";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import {
  DATE_FORMAT_VALUES,
  DATE_FORMATS,
  DateFormatKey,
} from "@/constants/dateFormats";
import {
  DECIMAL_SEPARATOR_VALUES,
  DECIMAL_SEPARATORS,
  DecimalSeparatorKey,
} from "@/constants/decimalSeparators";
import {
  FIRST_DAY_OF_THE_WEEK_VALUES,
  FIRST_DAYS_OF_THE_WEEK,
  FirstDayOfTheWeek,
} from "@/constants/firstDayOfTheWeek";
import { Locale, LOCALE_VALUES, LOCALES } from "@/constants/locales";
import { THEME_VALUES, ThemeKey } from "@/constants/themes";
import {
  TIME_FORMAT_VALUES,
  TIME_FORMATS,
  TimeFormat,
} from "@/constants/timeFormats";
import { TIMEZONES } from "@/constants/timezones";
import { AuthState, CurrentUser, useAuthUser } from "@/contexts/AuthContext";
import { useAutosave } from "@/hooks/useAutosave";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  AccountDetailsUpdateInputSchema,
  AccountDetailsUpdateSchema,
} from "@/schemas/auth";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Group, Loader, Select, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconSettings,
} from "@tabler/icons-react";

export default function Preferences() {
  const t = useTranslation();
  const {
    auth: { user },
    setAuth,
  } = useAuthUser();

  const currentAccountDetails = user.accountDetails || {
    locale: "en-US",
    theme: "DARK",
    color: "BLUE",
    timezone: "CET",
    dateFormat: "AUTO",
    decimalSeparator: "AUTO",
    timeFormat: "AUTO",
    firstDayOfWeek: "AUTO",
  };

  const datePreview = useMemo(
    () =>
      new Intl.DateTimeFormat(
        currentAccountDetails.dateFormat === DATE_FORMATS.MDY
          ? LOCALES.EN_US
          : currentAccountDetails.dateFormat === DATE_FORMATS.DMY
            ? LOCALES.NL_NL
            : undefined,
      ).format(new Date()),
    [currentAccountDetails.dateFormat],
  );

  const separatorPreview = useMemo(
    () =>
      new Intl.NumberFormat(
        currentAccountDetails.decimalSeparator === DECIMAL_SEPARATORS.DOT
          ? LOCALES.EN_US
          : currentAccountDetails.decimalSeparator === DECIMAL_SEPARATORS.COMMA
            ? LOCALES.NL_NL
            : undefined,
      ).format(1234.56),
    [currentAccountDetails.decimalSeparator],
  );

  const timePreview = useMemo(
    () =>
      new Intl.DateTimeFormat(
        currentAccountDetails.timeFormat === TIME_FORMATS.TWELVE
          ? LOCALES.EN_US
          : currentAccountDetails.timeFormat === TIME_FORMATS.TWENTYFOUR
            ? LOCALES.NL_NL
            : undefined,
        { timeStyle: "short" },
      ).format(new Date()),
    [currentAccountDetails.timeFormat],
  );

  const firstDayOfTheWeekPreview = useMemo(
    () =>
      currentAccountDetails.firstDayOfWeek === FIRST_DAYS_OF_THE_WEEK.AUTO
        ? dayjs().startOf("week").format("dddd")
        : t(
            `constants.firstDaysOfTheWeek.${
              currentAccountDetails.firstDayOfWeek as FirstDayOfTheWeek
            }`,
          ),
    [currentAccountDetails.firstDayOfWeek, t],
  );

  const formMethods = useForm<AccountDetailsUpdateInputSchema>({
    defaultValues: { id: user.id, ...user.accountDetails },
    resolver: valibotResolver(AccountDetailsUpdateSchema),
  });

  const { control } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          title={[{ label: t("preferencesPage.name"), icon: <IconSettings /> }]}
        >
          <SaveBadge user={user} setAuth={setAuth} />
        </DashboardHeader>
        <Sheet title={t("preferencesPage.system")}>
          <Stack>
            <Group grow>
              <Controller
                name="locale"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={error?.message}
                    label={t("preferencesPage.language")}
                    data={LOCALE_VALUES.map((locale: Locale) => ({
                      label: t(`constants.locales.${locale}`),
                      value: locale,
                    }))}
                    allowDeselect={false}
                    withAsterisk
                  />
                )}
              />
              <Controller
                name="theme"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={error?.message}
                    label={t("preferencesPage.theme")}
                    data={THEME_VALUES.map((theme: ThemeKey) => ({
                      label: t(`constants.themes.${theme}`),
                      value: theme,
                    }))}
                    allowDeselect={false}
                    withAsterisk
                  />
                )}
              />
              <Controller
                name="timezone"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={error?.message}
                    label={t("preferencesPage.timezone")}
                    data={TIMEZONES}
                    allowDeselect={false}
                    searchable
                    withAsterisk
                  />
                )}
              />
            </Group>
            <Group grow>
              <Stack>
                <Controller
                  name="dateFormat"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      error={error?.message}
                      label={t("preferencesPage.dateFormat")}
                      data={DATE_FORMAT_VALUES.map(
                        (dateformat: DateFormatKey) => ({
                          label: t(`constants.dateFormats.${dateformat}`),
                          value: dateformat,
                        }),
                      )}
                      allowDeselect={false}
                      withAsterisk
                      description={datePreview}
                    />
                  )}
                />
              </Stack>
              <Stack>
                <Controller
                  name="decimalSeparator"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      error={error?.message}
                      label={t("preferencesPage.decimalSeparator")}
                      data={DECIMAL_SEPARATOR_VALUES.map(
                        (separator: DecimalSeparatorKey) => ({
                          label: t(`constants.separators.${separator}`),
                          value: separator,
                        }),
                      )}
                      allowDeselect={false}
                      withAsterisk
                      description={separatorPreview}
                    />
                  )}
                />
              </Stack>
              <Stack>
                <Controller
                  name="timeFormat"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      error={error?.message}
                      label={t("preferencesPage.timeNotation")}
                      data={TIME_FORMAT_VALUES.map(
                        (timeformat: TimeFormat) => ({
                          label: t(`constants.timeFormats.${timeformat}`),
                          value: timeformat,
                        }),
                      )}
                      allowDeselect={false}
                      withAsterisk
                      description={timePreview}
                    />
                  )}
                />
              </Stack>
              <Stack>
                <Controller
                  name="firstDayOfWeek"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      error={error?.message}
                      label={t("preferencesPage.firstDayOfWeek")}
                      data={FIRST_DAY_OF_THE_WEEK_VALUES.map(
                        (firstDayOfWeek: FirstDayOfTheWeek) => ({
                          label: t(
                            `constants.firstDaysOfTheWeek.${firstDayOfWeek}`,
                          ),
                          value: firstDayOfWeek,
                        }),
                      )}
                      allowDeselect={false}
                      withAsterisk
                      description={firstDayOfTheWeekPreview}
                    />
                  )}
                />
              </Stack>
            </Group>
          </Stack>
        </Sheet>
        <Group align="flex-start" grow>
          {/* <Workinghours accountDetails={currentAccountDetails} />
        <Sheet title={t("preferencesPage.storage")}>
          <Group justify="space-between">
            <p>MB</p>
            <p>%</p>
            <p>GB</p>
          </Group>
          <Progress size="md" value={50} />
        </Sheet> */}
        </Group>
      </Stack>
    </FormProvider>
  );
}

type SaveBadgeProps = {
  user: CurrentUser | null;
  setAuth: (auth: AuthState) => any;
};

const SaveBadge = ({ user, setAuth }: SaveBadgeProps) => {
  const updatePreferences = useMutation("auth", "updateAccountDetails");
  const t = useTranslation();

  const { control, reset } = useFormContext<AccountDetailsUpdateInputSchema>();
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
      const updatedPreferences = await updatePreferences.mutate({
        ...values,
        id: user.id,
      });

      setAuth({
        user: { ...user, accountDetails: { ...updatedPreferences } },
      });

      reset({ id: user.id, ...updatedPreferences });
    } catch (error) {
      // TODO Fix typings
      const { success } = isJson((error as any).message);
      if (!success) {
        notifications.show({
          message: t("common.oops"),
          color: "red",
        });

        reset();

        return;
      }
    }
  });

  return (
    <Badge
      size="lg"
      color={
        isError
          ? "red"
          : isDirty || updatePreferences.loading
            ? "orange"
            : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updatePreferences.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updatePreferences.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
