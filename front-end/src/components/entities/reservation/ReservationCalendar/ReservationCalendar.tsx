"use client";

import Link from "next/link";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { useTranslation } from "@/hooks/useTranslation";
import { Position } from "@/types/Position";
import { RouterOutput } from "@/utils/trpc";
import { Button, Group } from "@mantine/core";
import { IconArrowMoveLeft, IconArrowMoveRight } from "@tabler/icons-react";

import styles from "./ReservationCalendar.module.scss";

dayjs.extend(isBetween);

export const compareDates = (firstDate: Dayjs, secondDate: Dayjs) => {
  return firstDate.startOf("day").isSame(secondDate.startOf("day"), "day");
};

dayjs.extend(isBetween);

type ReservationCalendarProps = {
  currentWeek: Dayjs[];
  currentRooms: RouterOutput["room"]["list"];
  reservations: RouterOutput["reservation"]["list"];
};

export const ReservationCalendar = ({
  currentRooms,
  currentWeek,
  reservations,
}: ReservationCalendarProps) => {
  const t = useTranslation();
  let reservationsShown: number[] = [];

  const getIndexDiff = (firstDate: Dayjs, secondDate: Dayjs) => {
    const firstIndex = currentWeek.findIndex(
      (day) => day.format("YYYY-MM-DD") === firstDate.format("YYYY-MM-DD"),
    );
    const secondIndex = currentWeek.findIndex(
      (day) => day.format("YYYY-MM-DD") === secondDate.format("YYYY-MM-DD"),
    );

    return Math.abs(firstIndex - secondIndex) + 1;
  };

  const getfilteredReservations = (id: number, weekDay: Dayjs) =>
    reservations.filter((reservation) => {
      if (
        reservation.roomId !== id ||
        reservationsShown.includes(reservation.id)
      )
        return;

      const startDate = dayjs(reservation.startDate);
      const endDate = dayjs(reservation.endDate);
      const isWithinCurrentWeek = weekDay.isBetween(
        startDate,
        endDate,
        "day",
        "[]",
      );
      const shouldShow = isWithinCurrentWeek;

      if (shouldShow) {
        reservationsShown = [...reservationsShown, reservation.id];
      }

      return shouldShow;
    });

  const calculateDateRange = (
    startDate: Dayjs,
    endDate: Dayjs,
    weekDay: Dayjs,
  ) => {
    const hasStart = currentWeek.some((day) => compareDates(day, startDate));
    const hasEnd = currentWeek.some((day) => compareDates(day, endDate));
    let multiplier;
    let left = 1;

    if (hasStart && hasEnd) {
      multiplier = Math.round(getIndexDiff(startDate, endDate));
      left = Math.round(getIndexDiff(weekDay, startDate));
    } else if (hasStart) {
      multiplier = getIndexDiff(startDate, currentWeek.at(-1)!);
      left = Math.round(getIndexDiff(weekDay, startDate));
    } else if (hasEnd) {
      multiplier = getIndexDiff(currentWeek[0], endDate);
    } else {
      multiplier = getIndexDiff(currentWeek[0], currentWeek.at(-1)!);
    }

    return { hasStart, hasEnd, multiplier, left };
  };

  if (!currentRooms.length)
    return (
      <div className={styles.noRooms}>
        {t("entities.reservation.calendar.noRooms")}
      </div>
    );

  return currentRooms
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    .map(({ name, id }) => {
      let positions: Position[] = [];

      return (
        <Group
          grow
          key={name}
          gap={0}
          className={styles.row}
          align="top"
          wrap="nowrap"
        >
          <div className={styles.room}>{name}</div>
          {currentWeek.map((weekDay, weekdayIndex) => {
            const overlappingReservations = reservations.filter(
              (reservation) =>
                weekDay.isBetween(
                  dayjs(reservation.startDate),
                  dayjs(reservation.endDate),
                  "day",
                  "[]",
                ) && id === reservation.roomId,
            );

            const reservationsToShow = getfilteredReservations(id, weekDay);

            return (
              <div
                key={name + weekdayIndex}
                style={{
                  height: `calc(${
                    34 * overlappingReservations.length
                  }px + 4px)`,
                }}
                className={styles.reservationContainer}
              >
                {reservationsToShow.map((reservation, reservationIndex) => {
                  const startDate = dayjs(reservation.startDate);
                  const endDate = dayjs(reservation.endDate);

                  const invoiced = reservation.invoicesJunction
                    .filter(
                      ({ reservationId, startDate, endDate, invoice }) => {
                        const start = dayjs(startDate);
                        const end = dayjs(endDate);

                        return (
                          reservationId === reservation.id &&
                          invoice.status === "issued" &&
                          invoice.type !== "credit" &&
                          currentWeek.some((weekDayDate) =>
                            dayjs(weekDayDate).isBetween(
                              start,
                              end,
                              null,
                              "[]",
                            ),
                          )
                        );
                      },
                    )
                    .map((invoice) => {
                      const { multiplier, left } = calculateDateRange(
                        dayjs(invoice.startDate),
                        dayjs(invoice.endDate),
                        weekDay,
                      );

                      return {
                        left: left,
                        width: multiplier,
                      };
                    });

                  // const title = `${
                  //   reservation.guestName ? `${reservation.guestName} - ` : ""
                  // }${reservation.customer.name}`;

                  const title = reservation.customer.name;

                  const correctWidth = currentWeek
                    .at(-1)!
                    .isBetween(startDate, endDate, "day", "[]")
                    ? 16
                    : 8;

                  const { hasStart, hasEnd, multiplier } = calculateDateRange(
                    startDate,
                    endDate,
                    weekDay,
                  );

                  let locatedPosition = positions.findIndex(
                    (pos) => pos && pos.end < reservation.startDate,
                  );

                  if (locatedPosition === -1)
                    locatedPosition = positions.length;

                  const top = locatedPosition * 34;

                  positions[locatedPosition] = {
                    id: reservation.id,
                    end: reservation.endDate,
                    top: top,
                  };

                  return (
                    <Button
                      key={`${reservation.room.name}-${reservationIndex}`}
                      component={Link}
                      // TODO: Bug seemed to be everywhere where you go to single pagination, maybe because of how mantine handles a Link component?
                      href={`/reservations/${reservation.id}`}
                      title={title}
                      size="xs"
                      classNames={{
                        root: styles.reservation,
                        label: styles.labelContainer,
                      }}
                      style={{
                        width: `calc(${100 * multiplier}% - ${correctWidth}px)`,
                        top: `${top}px`,
                      }}
                    >
                      <span className={styles.reservationBackground} />
                      {invoiced.map(({ left, width }, index) => {
                        return (
                          <span
                            key={`invoiced-${index}`}
                            className={styles.invoiced}
                            style={{
                              width: `calc(${(100 / multiplier) * width}%)`,
                              left: `calc(${(100 / multiplier) * (left - 1)}%)`,
                            }}
                          />
                        );
                      })}
                      <Group
                        grow
                        wrap="nowrap"
                        w="100%"
                        preventGrowOverflow={false}
                        className={clsx(styles.buttonContent, {
                          [styles.start]: hasStart && !hasEnd,
                          [styles.end]: hasEnd && !hasStart,
                          [styles.startEnd]: hasStart && hasEnd,
                        })}
                      >
                        {!hasStart && (
                          <IconArrowMoveLeft className={styles.icon} />
                        )}
                        <div className={styles.label}>{title}</div>
                        {!hasEnd && (
                          <IconArrowMoveRight className={styles.icon} />
                        )}
                      </Group>
                    </Button>
                  );
                })}
              </div>
            );
          })}
        </Group>
      );
    });
};
