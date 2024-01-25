"use client";

import Link from "next/link";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";

import { useTranslation } from "@/hooks/useTranslation";
import { Position } from "@/types/Position";
import { RouterOutput } from "@/utils/trpc";
import { Button, Group } from "@mantine/core";
import { IconArrowMoveLeft, IconArrowMoveRight } from "@tabler/icons-react";

import { isBetween } from "../../reservationsOverview";

import styles from "./reservations.module.scss";

export const compairDates = (firstDate: Dayjs, secondDate: Dayjs) => {
  return firstDate.startOf("day").isSame(secondDate.startOf("day"), "day");
};

const updatePositions = (
  positions: Position[],
  reservationsForDay: RouterOutput["reservation"]["list"],
) => {
  positions.forEach((position, index) => {
    if (!reservationsForDay.some((res) => res.id === position?.id)) {
      positions[index] = null;
    }
  });
  return positions.filter((pos) => pos !== null);
};

type reservationsProps = {
  currentRooms: {
    id: number;
    name: string;
    price: number;
  }[];
  currentWeek: Dayjs[];
  reservations: RouterOutput["reservation"]["list"];
};

export const ShowReservations = ({
  currentRooms,
  currentWeek,
  reservations,
}: reservationsProps) => {
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

  return currentRooms.length ? (
    currentRooms
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
            {/* TODO: Check op improvements */}
            {currentWeek.map((weekDay) => {
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
                  key={name}
                  style={{
                    height: `${34 * overlappingReservations.length}px`,
                  }}
                  className={styles.reservationContainer}
                >
                  {reservationsToShow.map((reservation, reservationIndex) => {
                    const startDate = dayjs(reservation.startDate);
                    const endDate = dayjs(reservation.endDate);

                    const title = `${
                      reservation.guestName ? `${reservation.guestName} - ` : ""
                    }${reservation.customer.firstName} ${
                      reservation.customer.lastName
                    }`;

                    const correctWidth = isBetween(
                      currentWeek.at(-1)!,
                      startDate,
                      endDate,
                    )
                      ? 12
                      : 6;

                    const hasStart = currentWeek.some((day) =>
                      compairDates(day, startDate),
                    );

                    const hasEnd = currentWeek.some((day) =>
                      compairDates(day, endDate),
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

                    positions = updatePositions(positions, reservations);

                    // Find the first available position
                    let allocatedPosition = positions.findIndex(
                      (pos) => pos && pos.end < reservation.startDate,
                    );
                    if (allocatedPosition === -1) {
                      allocatedPosition = positions.length;
                    }

                    const top = allocatedPosition * 34;

                    // Set the reservation's position
                    positions[allocatedPosition] = {
                      id: reservation.id,
                      end: reservation.endDate,
                      top: top,
                    };

                    return (
                      <Button
                        key={`${reservation.room.name}-${reservationIndex}`}
                        component={Link}
                        title={title}
                        size="xs"
                        ta="left"
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
                        pr="10px"
                        pl="10px"
                        // TODO: href error
                        href={`/reservations/${reservation.id}`}
                      >
                        <Group
                          grow
                          wrap="nowrap"
                          justify="space-between"
                          align="center"
                          w="100%"
                          preventGrowOverflow={false}
                        >
                          {((hasEnd && !hasStart) ||
                            (!hasStart && !hasEnd)) && (
                            <IconArrowMoveLeft className={styles.icon} />
                          )}
                          <div className={styles.label}>{title}</div>

                          {((hasStart && !hasEnd) ||
                            (!hasStart && !hasEnd)) && (
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
      })
  ) : (
    <div className={styles.noRooms}>
      {t("reservationPage.calendar.noRooms")}
    </div>
  );
};
