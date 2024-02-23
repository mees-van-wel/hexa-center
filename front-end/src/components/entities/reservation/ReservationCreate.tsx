"use client";

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
  ReservationCreateSchema,
  ReservationInputCreateSchema,
} from "@/schemas/reservation";
import { RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconHotelService } from "@tabler/icons-react";

import { ReservationForm } from "./ReservationForm";

type ReservationCreateProps = {
  rooms: RouterOutput["room"]["list"];
  relations: RouterOutput["relation"]["list"];
};

export const ReservationCreate = ({
  rooms,
  relations,
}: ReservationCreateProps) => {
  const t = useTranslation();

  const formMethods = useForm<ReservationInputCreateSchema>({
    resolver: valibotResolver(ReservationCreateSchema),
    defaultValues: {
      roomId: undefined,
      customerId: undefined,
      startDate: undefined,
      endDate: undefined,
      notes: "",
      guestName: "",
    },
  });

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          title={[
            {
              icon: <IconHotelService />,
              label: t("dashboardLayout.reservations"),
              href: "/reservations",
            },
            { label: t("common.new") },
          ]}
          backRouteFallback="/reservations"
        >
          <SaveButton />
        </DashboardHeader>
        <ReservationForm rooms={rooms} relations={relations} />
      </Stack>
    </FormProvider>
  );
};

const SaveButton = () => {
  const createReservation = useMutation("reservation", "create");
  const router = useRouter();
  const t = useTranslation();

  const { control, handleSubmit } =
    useFormContext<ReservationInputCreateSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<ReservationInputCreateSchema> = async (
    values,
  ) => {
    if (values.startDate > values.endDate) {
      notifications.show({
        message: t("entities.reservation.dateError"),
        color: "red",
      });

      return;
    }

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
