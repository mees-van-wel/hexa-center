"use client";

import { useMemo } from "react";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";

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
import { useAuthUser } from "@/contexts/AuthContext";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  PreferencesUpdateInputSchema,
  PreferencesUpdateSchema,
} from "@/schemas/preferences";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Group, Select, Stack } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

export default function Preferences() {
  const t = useTranslation();
  const { accountDetails } = useAuthUser();
  const updatePreferences = useMutation("auth", "updatePreference");

  const currentAccountDetails = accountDetails || {
    locale: "en-US",
    theme: "DARK",
    color: "BLUE",
    timezone: "CET",
    dateFormat: "AUTO",
    decimalSeparator: "AUTO",
    timeFormat: "AUTO",
    firstDayOfWeek: "AUTO",
  };

  const { control } = useForm<PreferencesUpdateInputSchema>({
    resolver: valibotResolver(PreferencesUpdateSchema),
    defaultValues: accountDetails,
  });

  const onSubmit = async (
    preferenceType: string,
    value: PreferencesUpdateInputSchema,
  ) => {
    await updatePreferences.mutate({ [preferenceType]: value });
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

  // TODO: update auth

  return (
    <Stack>
      <DashboardHeader
        title={[{ label: t("preferencesPage.name"), icon: <IconSettings /> }]}
      />
      <Sheet title={t("preferencesPage.system")}>
        <Stack>
          <Group grow>
            <Controller
              name="locale"
              control={control}
              defaultValue={control._defaultValues.locale}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("preferencesPage.language")}
                  data={LOCALE_VALUES.map((locale: Locale) => ({
                    label: t(`constants.locales.${locale}`),
                    value: locale,
                  }))}
                  onChange={(value) => {
                    field.onChange(onSubmit("locale", value));
                  }}
                  allowDeselect={false}
                  withAsterisk
                />
              )}
            />
            <Controller
              name="theme"
              control={control}
              defaultValue={control._defaultValues.theme}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("preferencesPage.theme")}
                  data={THEME_VALUES.map((theme: ThemeKey) => ({
                    label: t(`constants.themes.${theme}`),
                    value: theme,
                  }))}
                  onChange={(value) => {
                    field.onChange(onSubmit("theme", value));
                  }}
                  allowDeselect={false}
                  withAsterisk
                />
              )}
            />
            <Controller
              name="timezone"
              control={control}
              defaultValue={control._defaultValues.timezone}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("preferencesPage.timezone")}
                  data={TIMEZONES}
                  onChange={(value) => {
                    field.onChange(onSubmit("timezone", value));
                  }}
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
                name="dateformat"
                control={control}
                defaultValue={control._defaultValues.dateFormat}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t("preferencesPage.dateFormat")}
                    value={currentAccountDetails.dateFormat}
                    data={DATE_FORMAT_VALUES.map(
                      (dateformat: DateFormatKey) => ({
                        label: t(`constants.dateFormats.${dateformat}`),
                        value: dateformat,
                      }),
                    )}
                    onChange={(value) => {
                      field.onChange(onSubmit("dateFormat", value));
                    }}
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
                defaultValue={control._defaultValues.decimalSeparator}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t("preferencesPage.decimalSeparator")}
                    value={currentAccountDetails.decimalSeparator}
                    data={DECIMAL_SEPARATOR_VALUES.map(
                      (separator: DecimalSeparatorKey) => ({
                        label: t(`constants.separators.${separator}`),
                        value: separator,
                      }),
                    )}
                    onChange={(value) => {
                      field.onChange(onSubmit("decimalSeparator", value));
                    }}
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
                defaultValue={control._defaultValues.timeFormat}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t("preferencesPage.timeNotation")}
                    data={TIME_FORMAT_VALUES.map((timeformat: TimeFormat) => ({
                      label: t(`constants.timeFormats.${timeformat}`),
                      value: timeformat,
                    }))}
                    onChange={(value) => {
                      field.onChange(onSubmit("timeFormat", value));
                    }}
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
                defaultValue={control._defaultValues.firstDayOfWeek}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t("preferencesPage.firstDayOfWeek")}
                    data={FIRST_DAY_OF_THE_WEEK_VALUES.map(
                      (firstDayOfWeek: FirstDayOfTheWeek) => ({
                        label: t(
                          `constants.firstDaysOfTheWeek.${firstDayOfWeek}`,
                        ),
                        value: firstDayOfWeek,
                      }),
                    )}
                    onChange={(value) => {
                      field.onChange(onSubmit("firstDaysOfTheWeek", value));
                    }}
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
  );
}
