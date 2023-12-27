"use client";

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
import { IconPlus } from "@tabler/icons-react";

import { ReservationForm } from "./ReservationForm";

type ReservationsProps = {
  users: RouterOutput["user"]["list"];
};

export const ReservationNew = ({ users }: ReservationsProps) => {
  const t = useTranslation();
  const createReservation = useMutation("reservation", "create");

  const methods = useForm<ReservationInputCreateSchema>({
    // TODO: remove
    defaultValues: {
      roomId: 1,
    },
    resolver: valibotResolver(ReservationCreateSchema),
  });

  const onSubmit: SubmitHandler<ReservationInputCreateSchema> = (values) => {
    console.log({ ...values });
    createReservation.mutate({ ...values });
  };

  return (
    <FormProvider {...methods}>
      <form autoComplete="on" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader title={[{ label: "Reservations" }]}>
            <Button type="submit" leftSection={<IconPlus />}>
              {t("common.create")}
            </Button>
          </DashboardHeader>
          <Paper p={"1rem"}>
            <ReservationForm users={users} />
          </Paper>
        </Stack>
      </form>
    </FormProvider>
  );
};
