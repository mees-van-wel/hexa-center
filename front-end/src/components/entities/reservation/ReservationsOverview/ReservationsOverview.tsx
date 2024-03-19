"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";

import { CalendarSidebar } from "@/components/common/CalendarSidebar";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { CALENDAR_VIEWS, CalendarView } from "@/constants/calendarViews";
import { MONTH_VALUES } from "@/constants/months";
import { WEEKDAY_VALUES } from "@/constants/weekdays";
import { useTranslation } from "@/hooks/useTranslation";
import { type RouterOutput } from "@/utils/trpc";
import { Button, Group, Paper, Stack } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import {
  IconArrowBarLeft,
  IconArrowBarRight,
  IconHotelService,
  IconPlus,
} from "@tabler/icons-react";

import { ReservationCalendar } from "../ReservationCalendar";

import styles from "./ReservationsOverview.module.scss";

dayjs.extend(utc);
dayjs.extend(isBetween);

type ReservationsProps = {
  reservations: RouterOutput["reservation"]["list"];
  rooms: RouterOutput["room"]["list"];
  showAll?: boolean;
};

export const ReservationsOverview = ({
  reservations,
  rooms,
  showAll,
}: ReservationsProps) => {
  const t = useTranslation();
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  const [calendarCurrentDay, setCalendarCurrentDay] = useSessionStorage({
    key: "calendarCurrentDay",
    defaultValue: dayjs.utc().startOf("day").toISOString(),
  });

  const preferredStartDayIndex: number | "AUTO" = 1;
  const [calendarView, setCalendarView] = useState<CalendarView>(
    CALENDAR_VIEWS.WEEK,
  );
  const [sidebarToggle, setSideBarToggle] = useState(true);

  const currentWeek = useMemo(() => {
    let startOfWeek = dayjs(calendarCurrentDay)
      .startOf("week")
      .add(preferredStartDayIndex, "day");

    let fullWeek = Array.from({ length: 7 }, (_, index) =>
      startOfWeek.add(index, "day"),
    );

    let filteredWeek = fullWeek;

    if (calendarView === CALENDAR_VIEWS.WORKWEEK) {
      // TODO: use real workingHours
      filteredWeek = fullWeek.filter((day) =>
        [1, 2, 3, 4, 5].includes(day.day()),
      );
    } else if (calendarView !== CALENDAR_VIEWS.WEEK) {
      filteredWeek = [dayjs(calendarCurrentDay)];
    }

    filteredWeek.sort(
      (a, b) =>
        ((a.day() - preferredStartDayIndex + 7) % 7) -
        ((b.day() - preferredStartDayIndex + 7) % 7),
    );

    return filteredWeek;
  }, [calendarView, calendarCurrentDay, preferredStartDayIndex]);

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
                    weekDay.isBetween(
                      dayjs(reservation.startDate),
                      dayjs(reservation.endDate),
                      "day",
                      "[]",
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
            icon: <IconHotelService />,
            label: t("entities.reservation.pluralName"),
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
        <div className={styles.calendarContainer}>
          <Paper p="1rem">
            <Stack>
              <Group wrap="nowrap" grow gap={0} ta="center" fw="700">
                <div className={styles.roomName}>
                  {t("entities.reservation.calendar.roomName")}
                </div>
                {currentWeek.map((weekDay, index) => (
                  <div
                    key={`${weekDay.date()}-${index}`}
                    className={styles.weekDays}
                  >
                    <div
                      className={clsx({
                        [styles.currentDay]:
                          weekDay.date() === new Date().getDate(),
                      })}
                    >
                      {t(
                        `dates.weekdayNamesShort.${
                          WEEKDAY_VALUES[weekDay.day()]
                        }`,
                      )}{" "}
                      {weekDay.date()}
                      <br />
                      {t(`dates.monthsLong.${MONTH_VALUES[weekDay.month()]}`)}
                    </div>
                  </div>
                ))}
              </Group>

              <Stack gap={0} w="100%">
                <ReservationCalendar
                  currentWeek={currentWeek}
                  currentRooms={currentRooms}
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
          now={dayjs(calendarCurrentDay)}
          sideBarToggle={sidebarToggle}
          onDateChange={(value) => {
            setCalendarCurrentDay(value.toISOString());
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
