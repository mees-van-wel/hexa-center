"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

import { CalendarSidebar } from "@/components/common/CalendarSidebar";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { CALENDARVIEW, CalendarView } from "@/constants/calendarView";
import { MONTH_VALUES } from "@/constants/months";
import { WEEKDAY_VALUES } from "@/constants/weekdays";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
import { Button, Group, Paper, Stack } from "@mantine/core";
import {
  IconArrowBarLeft,
  IconArrowBarRight,
  IconPlus,
} from "@tabler/icons-react";

import { ShowReservations } from "./components/reservations/reservations";

import styles from "./reservations.module.scss";

dayjs.extend(utc);

type ReservationsProps = {
  reservations: RouterOutput["reservation"]["list"];
  rooms: RouterOutput["room"]["list"];
  showAll?: boolean;
};

// TODO: remove
export const toUTC = (date: Date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
};

export const isBetween = (
  betweenDate: Dayjs,
  startDate: Dayjs,
  endDate: Dayjs,
) => {
  const between = betweenDate.startOf("day");
  const start = startDate.startOf("day");
  const end = endDate.startOf("day");

  return (
    (between.isSame(start) || between.isAfter(start)) &&
    (between.isSame(end) || between.isBefore(end))
  );
};

const now = dayjs.utc().startOf("day").toDate();

export const Reservations = ({
  reservations,
  rooms,
  showAll,
}: ReservationsProps) => {
  const t = useTranslation();

  const preferredStartDayIndex: number | "AUTO" = 1;
  const [date, setDate] = useState(now);
  const [calendarView, setCalendarView] = useState<CalendarView>(
    CALENDARVIEW.WEEK,
  );
  const [sidebarToggle, setSideBarToggle] = useState(true);

  const currentWeek = useMemo(() => {
    let startOfWeek = dayjs(date)
      .startOf("week")
      .add(preferredStartDayIndex, "day");

    let fullWeek = Array.from({ length: 7 }, (_, index) =>
      startOfWeek.add(index, "day"),
    );

    let filteredWeek = fullWeek;

    if (calendarView === CALENDARVIEW.WORKWEEK) {
      filteredWeek = fullWeek.filter((day) => [1, 2].includes(day.day()));
    } else if (calendarView !== CALENDARVIEW.WEEK) {
      filteredWeek = [dayjs(date)];
    }

    filteredWeek.sort(
      (a, b) =>
        ((a.day() - preferredStartDayIndex + 7) % 7) -
        ((b.day() - preferredStartDayIndex + 7) % 7),
    );

    return filteredWeek;
  }, [calendarView, date, preferredStartDayIndex]);

  const currentRooms = useMemo(
    () =>
      showAll
        ? rooms
        : rooms.reduce<RouterOutput["room"]["list"]>((array, current) => {
            if (
              reservations.some(
                (reservation) =>
                  current.name === reservation.room.name &&
                  currentWeek.some((weekDay) =>
                    isBetween(
                      weekDay,
                      dayjs(reservation.startDate),
                      dayjs(reservation.endDate),
                    ),
                  ),
              )
            )
              array.push(current);
            return array;
          }, []),
    [currentWeek, reservations, rooms, showAll],
  );

  return (
    <Stack h="100%">
      <DashboardHeader
        title={[
          {
            label: t("dashboardLayout.reservations"),
          },
        ]}
      >
        <Button
          component={Link}
          href="/reservations/new"
          leftSection={<IconPlus />}
        >
          {t("common.new")}
        </Button>
      </DashboardHeader>

      <Group
        wrap="nowrap"
        gap={sidebarToggle ? "md" : 0}
        align="stretch"
        h="100%"
        className={styles.calendarOverview}
      >
        <div className={styles.calendar}>
          <Paper p={"1rem"} className={styles.calendarContainer}>
            <Stack>
              <Group wrap="nowrap" grow gap={0} ta="center" fw="700">
                <span className={styles.weekHidden} />
                {currentWeek.map((weekDay, index) => (
                  <div key={`${weekDay.date()}-${index}`}>
                    {t(
                      `dates.weekdayNamesShort.${
                        WEEKDAY_VALUES[weekDay.day()]
                      }`,
                    )}{" "}
                    {weekDay.date()}
                    <br />
                    {t(`dates.monthsLong.${MONTH_VALUES[weekDay.month()]}`)}
                  </div>
                ))}
              </Group>

              <Stack gap={0} w="100%">
                <ShowReservations
                  currentRooms={currentRooms}
                  currentWeek={currentWeek}
                  reservations={reservations}
                />
              </Stack>
            </Stack>
            <div
              className={styles.sideBarIcon}
              onClick={() => {
                setSideBarToggle(!sidebarToggle);
              }}
            >
              {sidebarToggle ? <IconArrowBarRight /> : <IconArrowBarLeft />}
            </div>
          </Paper>
        </div>
        <CalendarSidebar
          date={date}
          now={now}
          sideBarToggle={sidebarToggle}
          onDateChange={(value) => {
            setDate(toUTC(value));
          }}
          onCalendarViewChange={(value) => {
            setCalendarView(value);
          }}
          calendarView={calendarView}
        />
      </Group>
    </Stack>
  );
};
