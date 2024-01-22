"use client";

import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ReservationCreateSchema,
  ReservationInputCreateSchema,
} from "@/schemas/reservation";
import { RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Paper, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";

import { ReservationForm } from "./ReservationForm";

type ReservationNewProps = {
  rooms: RouterOutput["room"]["list"];
  users: RouterOutput["user"]["list"];
};

export const ReservationNew = ({ rooms, users }: ReservationNewProps) => {
  const t = useTranslation();
  const router = useRouter();
  const createReservation = useMutation("reservation", "create");

  const methods = useForm<ReservationInputCreateSchema>({
    resolver: valibotResolver(ReservationCreateSchema),
  });

  const onSubmit: SubmitHandler<ReservationInputCreateSchema> = async (
    values,
  ) => {
    if (values.startDate > values.endDate) {
      notifications.show({
        message: t("reservationPage.dateError"),
        color: "red",
      });

      return;
    }

    const reservation = await createReservation.mutate({ ...values });

    notifications.show({
      message: t("reservationPage.reservationCreated"),
      color: "green",
    });
    router.push(`/reservations/${reservation.id}`);
  };

  return (
    <Stack>
      <DashboardHeader
        title={[
          {
            label: t("dashboardLayout.reservations"),
            href: "/reservations",
          },
          { label: t("common.new") },
        ]}
      >
        <Button
          onClick={methods.handleSubmit(onSubmit)}
          leftSection={<IconPlus />}
        >
          {t("common.create")}
        </Button>
      </DashboardHeader>
      <Paper p={"1rem"}>
        <FormProvider {...methods}>
          <form autoComplete="on">
            <ReservationForm rooms={rooms} users={users} />
          </form>
        </FormProvider>
      </Paper>
    </Stack>
  );
};
