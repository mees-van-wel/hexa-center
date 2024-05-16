"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconHotelService } from "@tabler/icons-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import IsSameOrAfter from "dayjs/plugin/isSameOrAfter";
import IsSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ReservationCreateInputSchema,
  ReservationCreateSchema,
  ReservationDefaultsSchema,
} from "@/schemas/reservation";
import { type RouterOutput } from "@/utils/trpc";

import { ReservationForm } from "./ReservationForm";

dayjs.extend(IsSameOrAfter);
dayjs.extend(IsSameOrBefore);
dayjs.extend(isBetween);

export const overlapDates = (
  newStart: Date,
  newEnd: Date,
  reservationStart: Date,
  reservationEnd: Date,
) => {
  return (
    dayjs(reservationStart).isBetween(newStart, newEnd, "day", "[]") ||
    dayjs(reservationEnd).isBetween(newStart, newEnd, "day", "[]")
  );
};

type ReservationCreateProps = {
  rooms: RouterOutput["room"]["list"];
  customers: RouterOutput["customer"]["list"];
  reservations: RouterOutput["reservation"]["list"];
};

export const ReservationCreate = ({
  rooms,
  customers,
  reservations,
}: ReservationCreateProps) => {
  const t = useTranslation();

  const formMethods = useForm<ReservationDefaultsSchema>({
    resolver: valibotResolver(ReservationCreateSchema),
    defaultValues: {
      roomId: undefined,
      customerId: undefined,
      startDate: undefined,
      endDate: undefined,
      priceOverride: null,
      guestName: "",
      reservationNotes: "",
      invoiceNotes: "",
    },
  });

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          title={[
            {
              icon: <IconHotelService />,
              label: t("entities.reservation.pluralName"),
              href: "/reservations",
            },
            { label: t("common.new") },
          ]}
          backRouteFallback="/reservations"
        >
          <SaveButton reservations={reservations} />
        </DashboardHeader>
        <ReservationForm rooms={rooms} customers={customers} />
      </Stack>
    </FormProvider>
  );
};

type SaveButtonProps = {
  reservations: RouterOutput["reservation"]["list"];
};

const SaveButton = ({ reservations }: SaveButtonProps) => {
  const createReservation = useMutation("reservation", "create");
  const router = useRouter();
  const t = useTranslation();

  const { control, handleSubmit } =
    useFormContext<ReservationCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<ReservationCreateInputSchema> = async (
    values,
  ) => {
    const overlaps = reservations.some((reservation) => {
      if (values.roomId !== reservation.roomId) return;

      return overlapDates(
        values.startDate,
        values.endDate,
        reservation.startDate,
        reservation.endDate,
      );
    });

    if (values.startDate > values.endDate) {
      notifications.show({
        message: t("entities.reservation.dateError"),
        color: "red",
      });

      return;
    } else if (overlaps) {
      modals.openConfirmModal({
        title: t("common.areYouSure"),
        children: <div>{t("entities.reservation.overlapError")}</div>,
        labels: { confirm: t("common.yes"), cancel: t("common.no") },
        onConfirm: async () => {
          createHandler(values);
        },
      });

      return;
    }

    createHandler(values);
  };

  const createHandler = async (values: ReservationCreateInputSchema) => {
    const response = await createReservation.mutate(values);

    notifications.show({
      message: t("entities.reservation.reservationCreated"),
      color: "green",
    });

    router.push(`/reservations/${response.id}`);
  };

  return (
    <Button
      onClick={handleSubmit(submitHandler)}
      leftSection={<IconDeviceFloppy />}
      disabled={!isDirty}
      loading={createReservation.loading}
    >
      {t("common.save")}
    </Button>
  );
};
