"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import dayjs from "dayjs";

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

import styles from "./reservations.module.scss";
import Link from "next/link";

type ReservationsProps = {
  reservations: RouterOutput["reservation"]["list"];
  rooms: RouterOutput["room"]["list"];
  showAll?: boolean;
};

export const toUTC = (date: Date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
};

export const compairDates = (firstDate: Date, secondDate: Date) => {
  return (
    dayjs(toUTC(firstDate)).format("YYYY-MM-DD") ===
    dayjs(toUTC(secondDate)).format("YYYY-MM-DD")
  );
};

const isDateBetween = (date: Date, startDate: Date, endDate: Date) =>
  toUTC(date) >= toUTC(startDate) && toUTC(date) <= toUTC(endDate);

const now = new Date();
// now.setFullYear(2023);
// now.setMonth(11);
// now.setDate(21);
now.setHours(0, 0, 0, 0);

export const Reservations = ({
  reservations,
  rooms,
  showAll,
}: ReservationsProps) => {
  const t = useTranslation();
  const router = useRouter();

  const preferredStartDayIndex: number | "AUTO" = 1;
  const [date, setDate] = useState(now);
  const [calendarView, setCalendarView] = useState<CalendarView>(
    CALENDARVIEW.WEEK,
  );
  const [sidebarToggle, setSideBarToggle] = useState(false);

  const currentWeek = useMemo(() => {
    const utcDate = toUTC(date);

    let daysToSubtract = utcDate.getUTCDay() - preferredStartDayIndex;
    if (daysToSubtract < 0) daysToSubtract += 7;

    const startOfWeekTimestamp =
      utcDate.getTime() - daysToSubtract * 24 * 60 * 60 * 1000;

    const fullWeek = Array.from({ length: 7 }, (_, index) => {
      const dayTimestamp = startOfWeekTimestamp + index * 24 * 60 * 60 * 1000;
      return new Date(dayTimestamp);
    });

    const filteredWeek = fullWeek.filter((day) => {
      let weekDays: number[];

      switch (calendarView) {
        case CALENDARVIEW.WEEK:
          weekDays = [0, 1, 2, 3, 4, 5, 6];
          break;
        case CALENDARVIEW.WORKWEEK:
          weekDays = [1, 2, 3, 4, 5];
          break;
        default:
          weekDays = [utcDate.getUTCDay()];
          break;
      }
      return weekDays.includes(day.getUTCDay());
    });

    return filteredWeek.sort(
      (a, b) =>
        ((a.getUTCDay() - preferredStartDayIndex + 7) % 7) -
        ((b.getUTCDay() - preferredStartDayIndex + 7) % 7),
    );
  }, [calendarView, date]);

  const getIndexDiff = (firstDate: Date, secondDate: Date) => {
    const firstIndex = currentWeek.findIndex(
      (day) => day.toDateString() === firstDate.toDateString(),
    );
    const secondIndex = currentWeek.findIndex(
      (day) => day.toDateString() === secondDate.toDateString(),
    );

    return Math.abs(firstIndex - secondIndex) + 1;
  };

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
                    isDateBetween(
                      weekDay,
                      reservation.startDate,
                      reservation.endDate,
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
    <Stack>
      <DashboardHeader
        title={[
          {
            label: t("dashboardLayout.reservations"),
          },
        ]}
      >
        <Button type="submit" leftSection={<IconPlus />}>
          {t("common.new")}
        </Button>
      </DashboardHeader>
      <Paper p={"1rem"}>
        <Group grow wrap="nowrap" gap={sidebarToggle ? "md" : 0} align="start">
          {/* <Paper class="relative grow"> (check styling with sidebar) */}
          <div className={styles.calendar}>
            <Stack>
              <Group grow gap={0} ta="center" fw="700">
                <span
                  style={{
                    flexBasis: `calc(100% / ${currentWeek.length + 1})`,
                  }}
                  // className={styles.weekHidden}
                />
                {currentWeek.map((weekDay, index) => (
                  // TODO: use group to calc with inside prop? instead of div
                  <div
                    key={`${weekDay.getDate()}-${index}`}
                    style={{
                      flexBasis: `calc(100% / ${currentWeek.length + 1})`,
                    }}
                    // className={styles.week}
                  >
                    {t(
                      `dates.weekdayNamesShort.${
                        WEEKDAY_VALUES[weekDay.getDay()]
                      }`,
                    )}{" "}
                    {weekDay.getDate()}{" "}
                    {t(`dates.monthsLong.${MONTH_VALUES[weekDay.getMonth()]}`)}
                  </div>
                ))}
              </Group>

              <Stack gap={0}>
                {rooms.length ? (
                  rooms
                    .sort((a, b) =>
                      a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
                    )
                    .map(({ name }) => {
                      let reservationsShown: number[] = [];

                      return (
                        <Group key={name} gap={0} className={styles.rooms}>
                          <div
                            className={styles.room}
                            style={{
                              flexBasis: `calc(100% / ${
                                currentWeek.length + 1
                              })`,
                            }}
                          >
                            {name}
                          </div>
                          {/* TODO: Check op improvements */}
                          {currentWeek.map((weekDay) => {
                            const overlappingReservations = reservations.filter(
                              (reservation) => {
                                const betweenWeekday = isDateBetween(
                                  weekDay,
                                  reservation.startDate,
                                  reservation.endDate,
                                );
                                return (
                                  betweenWeekday &&
                                  name === reservation.room.name
                                );
                              },
                            );

                            const reservation = reservations.filter(
                              (reservation) => {
                                const betweenWeekday = isDateBetween(
                                  weekDay,
                                  reservation.startDate,
                                  reservation.endDate,
                                );

                                const betweenStart = isDateBetween(
                                  reservation.startDate,
                                  currentWeek[0],
                                  currentWeek[currentWeek.length - 1],
                                );

                                const dubbleReservation =
                                  name === reservation.room.name &&
                                  reservationsShown.includes(reservation.id);

                                const showReservation =
                                  name === reservation.room.name &&
                                  !dubbleReservation &&
                                  (compairDates(
                                    weekDay,
                                    reservation.startDate,
                                  ) ||
                                    (betweenWeekday &&
                                      (compairDates(weekDay, currentWeek[0]) ||
                                        betweenStart)));

                                if (showReservation) {
                                  reservationsShown = [
                                    ...reservationsShown,
                                    reservation.id,
                                  ];
                                }

                                return showReservation;
                              },
                            );

                            const add =
                              overlappingReservations.length > 1 ? 8 : 0;

                            return (
                              <div
                                key={`${name}${dayjs(weekDay).day()}`}
                                style={{
                                  flexBasis: `calc(100% / ${
                                    currentWeek.length + 1
                                  })`,
                                  height: `${
                                    34 * overlappingReservations.length + add
                                  }px`,
                                }}
                                className={styles.reservationContainer}
                              >
                                {reservation.map(
                                  (reservation, reservationIndex) => {
                                    let closestEndDate: Date | null =
                                      reservation.endDate;
                                    const hasStart = currentWeek.some((day) =>
                                      compairDates(day, reservation.startDate),
                                    );
                                    const hasEnd = currentWeek.some((day) =>
                                      compairDates(day, reservation.endDate),
                                    );

                                    const betweenStart = isDateBetween(
                                      reservation.startDate,
                                      currentWeek[0],
                                      currentWeek[currentWeek.length - 1],
                                    );

                                    const betweenEnd = isDateBetween(
                                      reservation.endDate,
                                      currentWeek[0],
                                      currentWeek[currentWeek.length - 1],
                                    );

                                    if (
                                      !hasEnd &&
                                      !hasStart &&
                                      betweenStart &&
                                      betweenEnd
                                    )
                                      currentWeek.forEach((date) => {
                                        if (date < reservation.endDate) {
                                          closestEndDate = date;
                                        }
                                      });

                                    // Switch case?
                                    const multiplier =
                                      hasEnd && hasStart
                                        ? Math.round(
                                            getIndexDiff(
                                              reservation.startDate,
                                              reservation.endDate,
                                            ),
                                          )
                                        : betweenStart && !betweenEnd
                                          ? getIndexDiff(
                                              weekDay,
                                              currentWeek[
                                                currentWeek.length - 1
                                              ],
                                            )
                                          : hasEnd
                                            ? getIndexDiff(
                                                currentWeek[0],
                                                reservation.endDate,
                                              )
                                            : betweenEnd
                                              ? getIndexDiff(
                                                  currentWeek[0],
                                                  closestEndDate,
                                                )
                                              : getIndexDiff(
                                                  currentWeek[0],
                                                  currentWeek[
                                                    currentWeek.length - 1
                                                  ],
                                                );

                                    reservationIndex = overlappingReservations
                                      .sort((a, b) => {
                                        if (a.startDate < b.startDate) {
                                          return -1;
                                        }
                                        if (a.startDate > b.startDate) {
                                          return 1;
                                        }
                                        return 0;
                                      })
                                      .indexOf(reservation);

                                    const title = `${
                                      reservation.guestName
                                        ? `${reservation.guestName} - `
                                        : ""
                                    }${reservation.customer.firstName} ${
                                      reservation.customer.lastName
                                    }`;

                                    return (
                                      <Button
                                        key={`${reservation.room.name}-${reservationIndex}`}
                                        component={Link}
                                        title={title}
                                        size="xs"
                                        ta="left"
                                        className={clsx(styles.reservation, {
                                          [styles.begin]: hasStart,
                                          [styles.end]: hasEnd,
                                        })}
                                        style={{
                                          width: `calc(${
                                            100 * multiplier - 6
                                          }%)`,
                                          top: `${34 * reservationIndex}px`,
                                        }}
                                        href={`/reservations/${reservation.id}`}
                                      >
                                        {title}
                                      </Button>
                                    );
                                  },
                                )}
                              </div>
                            );
                          })}
                        </Group>
                      );
                    })
                ) : (
                  <div class="border-t border-gray-4 bg-gray-0 p-2 text-center dark:border-gray-8 dark:bg-gray-9">
                    {t("reservationPage.calendar.noRooms")}
                  </div>
                )}
              </Stack>
            </Stack>
            <div
              class="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-0 bg-white"
              onClick$={() => {
                setSideBarToggle(!sidebarToggle);
              }}
            >
              {sidebarToggle ? <IconArrowBarRight /> : <IconArrowBarLeft />}
            </div>
          </div>
          {/* <CalendarSidebar
            date={date.value}
            now={now}
            sideBarToggle={sideBarToggle.value}
            onDateChange$={(value) => {
              date.value = toUTC(value);
            }}
            onCalendarViewChange$={(value) => {
              CalendarView.value = value;
            }}
            CalendarView={CalendarView.value}
          /> */}
        </Group>
      </Paper>
    </Stack>
  );
};
