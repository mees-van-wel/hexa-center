"use client";

import { useMemo } from "react";
import dayjs from "dayjs";

import { Sheet } from "@/components/common/Sheet/Sheet";
import { Workinghours } from "@/components/common/Workinghours";
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
import { useAuthRelation } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge, Button, Group, Progress, Select, Stack } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

export default function Preferences() {
  const t = useTranslation();
  const settings = useAuthRelation().account;

  const datePreview = useMemo(
    () =>
      new Intl.DateTimeFormat(
        settings.dateFormat === DATE_FORMATS.MDY
          ? LOCALES.EN_US
          : settings.dateFormat === DATE_FORMATS.DMY
            ? LOCALES.NL_NL
            : undefined,
      ).format(new Date()),
    [settings.dateFormat],
  );

  const separatorPreview = useMemo(
    () =>
      new Intl.NumberFormat(
        settings.decimalSeparator === DECIMAL_SEPARATORS.DOT
          ? LOCALES.EN_US
          : settings.decimalSeparator === DECIMAL_SEPARATORS.COMMA
            ? LOCALES.NL_NL
            : undefined,
      ).format(1234.56),
    [settings.decimalSeparator],
  );

  const timePreview = useMemo(
    () =>
      new Intl.DateTimeFormat(
        settings.timeFormat === TIME_FORMATS.TWELVE
          ? LOCALES.EN_US
          : settings.timeFormat === TIME_FORMATS.TWENTYFOUR
            ? LOCALES.NL_NL
            : undefined,
        { timeStyle: "short" },
      ).format(new Date()),
    [settings.timeFormat],
  );

  const firstDayOfTheWeekPreview = useMemo(
    () =>
      settings.firstDayOfWeek === FIRST_DAYS_OF_THE_WEEK.AUTO
        ? dayjs().startOf("week").format("dddd")
        : t(
            `constants.firstDaysOfTheWeek.${
              settings.firstDayOfWeek as FirstDayOfTheWeek
            }`,
          ),
    [settings.firstDayOfWeek, t],
  );

  // TODO: update auth

  return (
    <Stack>
      <DashboardHeader
        title={[{ label: t("preferencesPage.name"), icon: <IconSettings /> }]}
      >
        <Button>{t("common.create")}</Button>
        <Badge size="lg" color="green">
          {t("common.saved")}
        </Badge>
      </DashboardHeader>
      <Sheet title={t("preferencesPage.system")}>
        <Stack>
          <Group grow>
            <Select
              label={t("preferencesPage.language")}
              value={settings.locale}
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
              value={settings.theme}
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
              value={settings.timezone}
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
                value={settings.dateFormat}
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
                value={settings.decimalSeparator}
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
                value={settings.timeFormat}
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
                value={settings.firstDayOfWeek}
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
        <Workinghours account={settings} />
        <Sheet title={t("preferencesPage.storage")}>
          <Group justify="space-between">
            <p>MB</p>
            <p>%</p>
            <p>GB</p>
          </Group>
          <Progress size="md" value={50} />
        </Sheet>
      </Group>
    </Stack>
  );
}
