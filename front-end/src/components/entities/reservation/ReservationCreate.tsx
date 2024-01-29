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
import { Button, Paper, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy } from "@tabler/icons-react";

import { ReservationForm } from "./ReservationForm";

type ReservationCreateProps = {
  rooms: RouterOutput["room"]["list"];
  users: RouterOutput["user"]["list"];
};

export const ReservationCreate = ({ rooms, users }: ReservationCreateProps) => {
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
              label: t("dashboardLayout.reservations"),
              href: "/reservations",
            },
            { label: t("common.new") },
          ]}
          backRouteFallback="/reservations"
        >
          <SaveButton />
        </DashboardHeader>
        <Paper p={"1rem"}>
          <ReservationForm rooms={rooms} users={users} />
        </Paper>
      </Stack>
    </FormProvider>
  );
};

const SaveButton = () => {
  const createUser = useMutation("reservation", "create");
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

    const response = await createUser.mutate(values);

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
      loading={createUser.loading}
    >
      {t("common.save")}
    </Button>
  );
};
