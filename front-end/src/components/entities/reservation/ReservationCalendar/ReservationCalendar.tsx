"use client";

import Link from "next/link";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";

import { useTranslation } from "@/hooks/useTranslation";
import { Position } from "@/types/Position";
import { RouterOutput } from "@/utils/trpc";
import { Button, Group } from "@mantine/core";
import { IconArrowMoveLeft, IconArrowMoveRight } from "@tabler/icons-react";

import { isBetween } from "../ReservationsOverview";

import styles from "./ReservationCalendar.module.scss";

export const compareDates = (firstDate: Dayjs, secondDate: Dayjs) => {
  return firstDate.startOf("day").isSame(secondDate.startOf("day"), "day");
};

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
      const isWithinCurrentWeek = isBetween(weekDay, startDate, endDate);
      const shouldShow = isWithinCurrentWeek;

      if (shouldShow) {
        reservationsShown = [...reservationsShown, reservation.id];
      }

      return shouldShow;
    });

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
                isBetween(
                  weekDay,
                  dayjs(reservation.startDate),
                  dayjs(reservation.endDate),
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

                  // const title = `${
                  //   reservation.guestName ? `${reservation.guestName} - ` : ""
                  // }${reservation.customer.name}`;

                  const title = reservation.customer.name;

                  const correctWidth = isBetween(
                    currentWeek.at(-1)!,
                    startDate,
                    endDate,
                  )
                    ? 16
                    : 8;

                  const hasStart = currentWeek.some((day) =>
                    compareDates(day, startDate),
                  );

                  const hasEnd = currentWeek.some((day) =>
                    compareDates(day, endDate),
                  );

                  let widthMultiplier;
                  if (hasStart && hasEnd) {
                    widthMultiplier = Math.round(
                      getIndexDiff(startDate, endDate),
                    );
                  } else if (hasStart) {
                    widthMultiplier = getIndexDiff(
                      weekDay,
                      currentWeek.at(-1)!,
                    );
                  } else if (hasEnd) {
                    widthMultiplier = getIndexDiff(currentWeek[0], endDate);
                  } else {
                    widthMultiplier = getIndexDiff(
                      currentWeek[0],
                      currentWeek.at(-1)!,
                    );
                  }

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
                        root: clsx(styles.reservation, {
                          [styles.start]: hasStart && !hasEnd,
                          [styles.end]: hasEnd && !hasStart,
                          [styles.startEnd]: hasStart && hasEnd,
                        }),
                        label: styles.labelContainer,
                      }}
                      style={{
                        width: `calc(${
                          100 * widthMultiplier
                        }% - ${correctWidth}px)`,
                        top: `${top}px`,
                      }}
                    >
                      <Group
                        grow
                        wrap="nowrap"
                        w="100%"
                        preventGrowOverflow={false}
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
