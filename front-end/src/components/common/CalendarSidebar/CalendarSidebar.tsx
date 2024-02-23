"use client";

import { useMemo } from "react";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";

import { CALENDAR_VIEWS, CalendarView } from "@/constants/calendarViews";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Paper, Stack } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconArrowBack, IconArrowForward } from "@tabler/icons-react";

import styles from "./CalendarSidebar.module.scss";

type CalendarSidebarProps = {
  now: Dayjs;
  sideBarToggle: boolean;
  onDateChange: (value: Dayjs) => void;
  onCalendarViewChange: (value: CalendarView) => void;
  calendarView?: string;
};

export const CalendarSidebar = ({
  now,
  // onCalendarViewChange,
  sideBarToggle,
  onDateChange,
  calendarView = CALENDAR_VIEWS.WEEK,
}: CalendarSidebarProps) => {
  const t = useTranslation();
  const today = dayjs();

  const ChangeWeek = useMemo(
    () => (days: number) => {
      onDateChange(dayjs(now).add(days, "day"));
    },
    [now, onDateChange],
  );

  return (
    <div
      className={clsx(styles.sidebarContainer, {
        [styles.closed]: !sideBarToggle,
      })}
    >
      <Paper p="md" h="100%" w="100%">
        <Stack ta="center">
          {/* <p>
            {t(`dates.weekdayNamesShort.${WEEKDAY_VALUES[now.day()]}`)}{" "}
            {dayjs(now).date()}{" "}
            {t(`dates.monthsLong.${MONTH_VALUES[dayjs(now).month()]}`)}
          </p> */}
          <DateInput
            value={now.toDate()}
            required
            onChange={(value) => {
              value &&
                onDateChange(
                  dayjs(value)
                    .set("hour", 0)
                    .set("minute", 0)
                    .set("second", 0)
                    .set("millisecond", 0),
                );
            }}
          />
          <Button.Group>
            <Button
              onClick={() => {
                ChangeWeek(calendarView !== CALENDAR_VIEWS.DAY ? -7 : -1);
              }}
            >
              <IconArrowBack size={50} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onDateChange(today);
              }}
              w="100%"
            >
              {t("common.today")}
            </Button>
            <Button
              onClick={() => {
                ChangeWeek(calendarView !== CALENDAR_VIEWS.DAY ? 7 : 1);
              }}
            >
              <IconArrowForward size={50} />
            </Button>
          </Button.Group>
          {/* <SegmentedControl
            data={[
              { label: t("common.week"), value: CALENDAR_VIEWS.WEEK },
              {
                label: t("common.workweek"),
                value: CALENDAR_VIEWS.WORKWEEK,
              },
              { label: t("common.day"), value: CALENDAR_VIEWS.DAY },
            ]}
            onChange={(value) => {
              onCalendarViewChange(value as CalendarView);
            }}
            orientation="vertical"
            size="sm"
            w="100%"
          /> */}
        </Stack>
      </Paper>
    </div>
  );
};
