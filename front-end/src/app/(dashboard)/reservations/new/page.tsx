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

import { ReservationForm } from "@/components/entities/reservation/ReservationForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ReservationCreateInputSchema,
  ReservationCreateSchema,
  ReservationDefaultsSchema,
} from "@/schemas/reservation";

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

export default function Page() {
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
          <SaveButton />
        </DashboardHeader>
        <ReservationForm />
      </Stack>
    </FormProvider>
  );
}

const SaveButton = () => {
  const listReservations = useQuery("reservation", "list", {
    skipInitial: true,
  });
  const createReservation = useMutation("reservation", "create");
  const router = useRouter();
  const t = useTranslation();
  const memory = useMemory();

  const { control, handleSubmit } =
    useFormContext<ReservationCreateInputSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<ReservationCreateInputSchema> = async (
    values,
  ) => {
    const reservations = await listReservations.query();

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

    memory.write(response, [
      {
        scope: "reservation",
        procedure: "get",
        params: response.id,
      },
      {
        scope: "reservation",
        procedure: "list",
        as: ({ current, result }) =>
          current ? [...current, result] : undefined,
      },
    ]);

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
