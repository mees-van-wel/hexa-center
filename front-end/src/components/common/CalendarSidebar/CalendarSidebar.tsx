"use client";

import clsx from "clsx";
import dayjs from "dayjs";

import { CALENDARVIEW, CalendarView } from "@/constants/calendarView";
import { MONTH_VALUES } from "@/constants/months";
import { WEEKDAY_VALUES } from "@/constants/weekdays";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Group, Paper, SegmentedControl, Stack } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconArrowBack, IconArrowForward } from "@tabler/icons-react";

import styles from "./CalendarSidebar.module.scss";

type CalendarSidebarProps = {
  date: Date;
  now: Date;
  sideBarToggle: boolean;
  onDateChange: (value: Date) => void;
  onCalendarViewChange: (value: CalendarView) => void;
  calendarView?: string;
};

export const CalendarSidebar = ({
  date,
  now,
  onCalendarViewChange,
  sideBarToggle,
  onDateChange,
  calendarView = CALENDARVIEW.WEEK,
}: CalendarSidebarProps) => {
  const t = useTranslation();

  // TODO: UseMemo?
  const ChangeWeek = (days: number) => {
    onDateChange(new Date(date.getTime() + days * 24 * 60 * 60 * 1000));
  };

  return (
    <div
      className={clsx(styles.sidebarContainer, {
        [styles.closed]: !sideBarToggle,
      })}
    >
      <div className={styles.sidebar}>
        <Paper p="md" h="100%" w="100%">
          <Stack ta="center">
            <p>
              {t(`dates.weekdayNamesShort.${WEEKDAY_VALUES[date.getDay()]}`)}{" "}
              {dayjs(date).date()}{" "}
              {t(`dates.monthsLong.${MONTH_VALUES[dayjs(date).month()]}`)}
            </p>

            <Button.Group>
              <Button
                onClick={() => {
                  ChangeWeek(calendarView !== CALENDARVIEW.DAY ? -7 : -1);
                }}
              >
                <IconArrowBack size={50} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDateChange(now);
                }}
                w="100%"
              >
                {t("common.today")}
              </Button>
              <Button
                onClick={() => {
                  ChangeWeek(calendarView !== CALENDARVIEW.DAY ? 7 : 1);
                }}
              >
                <IconArrowForward size={50} />
              </Button>
            </Button.Group>

            <SegmentedControl
              data={[
                { label: t("common.week"), value: CALENDARVIEW.WEEK },
                {
                  label: t("common.workweek"),
                  value: CALENDARVIEW.WORKWEEK,
                },
                { label: t("common.day"), value: CALENDARVIEW.DAY },
              ]}
              onChange={(value) => {
                onCalendarViewChange(value as CalendarView);
              }}
              orientation="vertical"
              size="sm"
              w="100%"
            />

            <Group grow align="end">
              <DateInput
                value={date}
                required
                onChange={(value) => {
                  value && onDateChange(new Date(value.setHours(0, 0, 0, 0)));
                }}
              />
            </Group>
          </Stack>
        </Paper>
      </div>
    </div>
  );
};
