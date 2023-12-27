"use client";

import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ReservationInputUpdateSchema,
  ReservationUpdateSchema,
} from "@/schemas/reservation";
import { RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconTrash } from "@tabler/icons-react";

import { ReservationForm } from "./ReservationForm";

type ReservationProps = {
  reservation: RouterOutput["reservation"]["get"];
  rooms: RouterOutput["room"]["list"];
  users: RouterOutput["user"]["list"];
};

export const Reservation = ({
  reservation,
  rooms,
  users,
}: ReservationProps) => {
  const t = useTranslation();
  const router = useRouter();
  const updateReservation = useMutation("reservation", "update");
  const deleteReservation = useMutation("reservation", "delete");

  const methods = useForm<ReservationInputUpdateSchema>({
    defaultValues: {
      id: reservation.id,
      roomId: reservation.roomId,
      customerId: reservation.customerId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      notes: reservation.notes,
      guestName: reservation.guestName,
    },
    resolver: valibotResolver(ReservationUpdateSchema),
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit: SubmitHandler<ReservationInputUpdateSchema> = async ({
    roomId,
    customerId,
    startDate,
    endDate,
    notes,
    guestName,
  }) => {
    if (
      (startDate || reservation.startDate) > (endDate || reservation.endDate)
    ) {
      notifications.show({
        message: t("reservationPage.dateError"),
        color: "red",
      });

      return;
    }

    await updateReservation.mutate({
      id: reservation.id,
      roomId,
      customerId,
      startDate,
      endDate,
      notes,
      guestName,
    });
    reset({
      id: reservation.id,
      roomId,
      customerId,
      startDate,
      endDate,
      notes,
      guestName,
    });
  };

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      children: <div>{t("reservationPage.confirmDeleteModal")}</div>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: onDelete,
    });
  };

  const onDelete = async () => {
    await deleteReservation.mutate(reservation.id);
    notifications.show({
      message: t("reservationPage.roomDeleted"),
      color: "green",
    });
    router.push("/reservations");
  };

  return (
    <FormProvider {...methods}>
      <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/reservations"
            title={[
              {
                label: t("dashboardLayout.reservations"),
                href: "/reservations",
              },
              {
                label: `${reservation.users.firstName} ${reservation.users.lastName}`,
              },
            ]}
          >
            {formState.isDirty && (
              <Button type="submit" leftSection={<IconDeviceFloppy />}>
                {t("common.save")}
              </Button>
            )}
            <Button
              variant="light"
              color="red"
              onClick={deletehandler}
              leftSection={<IconTrash />}
            >
              {t("common.delete")}
            </Button>
            <Badge
              size="lg"
              variant="light"
              color={updateReservation.loading ? "orange" : "green"}
              leftSection={<IconCheck size="1rem" />}
            >
              {updateReservation.loading
                ? t("common.saving")
                : t("common.saved")}
            </Badge>
          </DashboardHeader>
          <Paper p={"1rem"}>
            <ReservationForm rooms={rooms} users={users} />
          </Paper>
        </Stack>
      </form>
    </FormProvider>
  );
};
