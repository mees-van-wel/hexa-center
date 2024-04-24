"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";

import { FIRST_DAYS_OF_THE_WEEK } from "@/constants/firstDayOfTheWeek";
import { Weekday, WEEKDAY_VALUES, WEEKDAYS } from "@/constants/weekdays";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";
import { Button, Group, SegmentedControl, Stack } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconMinus, IconPlus } from "@tabler/icons-react";

import { Sheet } from "../Sheet";

import styles from "./WorkingHours.module.scss";

type workinghoursProps = {
  accountDetails: RouterOutput["auth"]["currentUser"]["accountDetails"];
};

export const Workinghours = ({ accountDetails }: workinghoursProps) => {
  var customParseFormat = require("dayjs/plugin/customParseFormat");
  var isBetween = require("dayjs/plugin/isBetween");
  dayjs.extend(isBetween);
  dayjs.extend(customParseFormat);
  const t = useTranslation();
  const [currentStartTime, setCurrentStartTime] = useState("09:00");
  const [currentEndTime, setCurrentEndTime] = useState("17:00");
  const addWorkingHour = useMutation("workingHour", "create");

  const overlap = () => {
    for (let item of accountDetails.workingHours) {
      const start = item.startTime;
      const end = item.endTime;
      const dayStart = item.startDay;
      const dayEnd = item.endDay;

      if (
        dayStart === dayEnd &&
        ((currentStartTime < end && currentStartTime > start) ||
          (currentEndTime < end && currentEndTime > start) ||
          (start < currentEndTime && start > currentStartTime) ||
          (end < currentEndTime && end > currentStartTime))
      ) {
        return true;
      } else if (dayStart !== dayEnd && currentEndTime > start) {
        return true;
      } else if (
        currentEndTime < currentStartTime &&
        currentStartTime < start
      ) {
        return true;
      }
    }
  };

  const createHandler = () => {
    const startDay = sortedWeekdays.indexOf(currentWeekday);
    const endDay =
      currentEndTime < currentStartTime
        ? sortedWeekdays.indexOf(currentWeekday) === 6
          ? 0
          : sortedWeekdays.indexOf(currentWeekday) + 1
        : sortedWeekdays.indexOf(currentWeekday);
    if (overlap() === true) {
      return showNotification({
        message: t("preferencesPage.workingHours.overlaps"),
        color: "red",
      });
    }

    addWorkingHour.mutate({
      accountId: accountDetails.id,
      startDay: startDay,
      endDay: endDay,
      startTime: currentStartTime,
      endTime: currentEndTime,
    });
  };

  const deleteWorkingHour = useMutation("workingHour", "delete");

  const deleteHandler = (workingHourId: number) => {
    deleteWorkingHour.mutate(workingHourId);
  };

  const [currentWeekday, setCurrentWeekday] = useState<Weekday>(
    WEEKDAYS.MONDAY,
  );

  const startIndex = WEEKDAY_VALUES.indexOf(
    (accountDetails?.firstDayOfWeek === FIRST_DAYS_OF_THE_WEEK.AUTO
      ? dayjs().startOf("week").format("dddd").toUpperCase()
      : accountDetails?.firstDayOfWeek) as Weekday,
  );

  const sortedWeekdays = useMemo(
    () => [
      ...WEEKDAY_VALUES.slice(startIndex),
      ...WEEKDAY_VALUES.slice(0, startIndex),
    ],
    [startIndex],
  );

  return (
    <Sheet title={t("preferencesPage.workingHours.name")}>
      <Group align="flex-start">
        <SegmentedControl
          orientation="vertical"
          data={sortedWeekdays.map((weekday: Weekday) => ({
            label: t(`constants.weekdays.${weekday}`),
            value: weekday,
          }))}
          onChange={(value) => setCurrentWeekday(value as Weekday)}
        />
        {sortedWeekdays.map((weekday) =>
          weekday !== currentWeekday ? null : (
            <Stack key={weekday} className={styles.workingHours}>
              <Group align="flex-end">
                <TimeInput
                  onChange={(event) => {
                    setCurrentStartTime(event.target.value);
                  }}
                  label="Start"
                />
                <TimeInput
                  onChange={(event) => {
                    setCurrentEndTime(event.target.value);
                  }}
                  label="End"
                />
                <Button onClick={createHandler}>
                  <IconPlus />
                </Button>
              </Group>
              {accountDetails?.workingHours &&
                accountDetails?.workingHours
                  .filter(
                    ({ startDay, endDay }) =>
                      sortedWeekdays.indexOf(sortedWeekdays[startDay]) ===
                        sortedWeekdays.indexOf(currentWeekday) ||
                      sortedWeekdays.indexOf(sortedWeekdays[endDay]) ===
                        sortedWeekdays.indexOf(currentWeekday),
                  )
                  .sort(
                    (a, b) =>
                      sortedWeekdays.indexOf(sortedWeekdays[a.startDay]) -
                        sortedWeekdays.indexOf(sortedWeekdays[b.startDay]) ||
                      parseInt(a.startTime.slice(0, 5)) -
                        parseInt(b.endTime.slice(0, 5)),
                  )
                  .map(({ id, startDay, endDay, startTime, endTime }) => (
                    <div key={id}>
                      <Group align="flex-end">
                        {sortedWeekdays.indexOf(sortedWeekdays[startDay]) ===
                          sortedWeekdays.indexOf(currentWeekday) && (
                          <TimeInput
                            label="Start"
                            value={`${startTime
                              .toString()
                              .slice(0, 2)}:${startTime
                              .toString()
                              .slice(3, 5)}`}
                            disabled
                          />
                        )}
                        {sortedWeekdays.indexOf(sortedWeekdays[endDay]) ===
                          sortedWeekdays.indexOf(currentWeekday) && (
                          <TimeInput
                            label="End"
                            value={`${endTime.toString().slice(0, 2)}:${endTime
                              .toString()
                              .slice(3, 5)}`}
                            disabled
                          />
                        )}
                        <Button
                          variant="light"
                          onClick={() => deleteHandler(id)}
                        >
                          <IconMinus />
                        </Button>
                      </Group>
                    </div>
                  ))}
            </Stack>
          ),
        )}
      </Group>
    </Sheet>
  );
};
