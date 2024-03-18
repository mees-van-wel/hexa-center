"use client";

import { useMemo } from "react";
import dayjs from "dayjs";

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
import { useTranslation } from "@/hooks/useTranslation";
import { Group, Select, Stack } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

export default function Preferences() {
  const t = useTranslation();
  const { accountDetails } = useAuthUser();

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
            <Select
              label={t("preferencesPage.language")}
              value={currentAccountDetails.locale || "en-US"}
              data={LOCALE_VALUES.map((locale: Locale) => ({
                label: t(`constants.locales.${locale}`),
                value: locale,
              }))}
              allowDeselect={false}
              withAsterisk
              disabled
            />
            <Select
              label={t("preferencesPage.theme")}
              value={currentAccountDetails.theme}
              data={THEME_VALUES.map((theme: ThemeKey) => ({
                label: t(`constants.themes.${theme}`),
                value: theme,
              }))}
              allowDeselect={false}
              withAsterisk
              disabled
            />
            <Select
              label={t("preferencesPage.timezone")}
              value={currentAccountDetails.timezone}
              data={TIMEZONES}
              allowDeselect={false}
              searchable
              withAsterisk
              disabled
            />
          </Group>
          <Group grow>
            <Stack>
              <Select
                label={t("preferencesPage.dateFormat")}
                value={currentAccountDetails.dateFormat}
                data={DATE_FORMAT_VALUES.map((dateformat: DateFormatKey) => ({
                  label: t(`constants.dateFormats.${dateformat}`),
                  value: dateformat,
                }))}
                allowDeselect={false}
                withAsterisk
                description={datePreview}
                disabled
              />
            </Stack>
            <Stack>
              <Select
                label={t("preferencesPage.decimalSeparator")}
                value={currentAccountDetails.decimalSeparator}
                data={DECIMAL_SEPARATOR_VALUES.map(
                  (separator: DecimalSeparatorKey) => ({
                    label: t(`constants.separators.${separator}`),
                    value: separator,
                  }),
                )}
                allowDeselect={false}
                withAsterisk
                description={separatorPreview}
                disabled
              />
            </Stack>
            <Stack>
              <Select
                label={t("preferencesPage.timeNotation")}
                value={currentAccountDetails.timeFormat}
                data={TIME_FORMAT_VALUES.map((timeformat: TimeFormat) => ({
                  label: t(`constants.timeFormats.${timeformat}`),
                  value: timeformat,
                }))}
                allowDeselect={false}
                withAsterisk
                description={timePreview}
                disabled
              />
            </Stack>
            <Stack>
              <Select
                label={t("preferencesPage.firstDayOfWeek")}
                value={currentAccountDetails.firstDayOfWeek}
                data={FIRST_DAY_OF_THE_WEEK_VALUES.map(
                  (firstDayOfWeek: FirstDayOfTheWeek) => ({
                    label: t(`constants.firstDaysOfTheWeek.${firstDayOfWeek}`),
                    value: firstDayOfWeek,
                  }),
                )}
                allowDeselect={false}
                withAsterisk
                description={firstDayOfTheWeekPreview}
                disabled
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
