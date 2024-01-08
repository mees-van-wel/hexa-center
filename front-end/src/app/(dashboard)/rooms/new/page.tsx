"use client";

import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { RoomForm } from "@/components/pages/rooms/RoomForm";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { RoomCreateSchema, RoomInputCreateSchema } from "@/schemas/room";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Paper, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";

export default function Page() {
  const t = useTranslation();
  const createRoom = useMutation("room", "create");
  const router = useRouter();

  const methods = useForm<RoomInputCreateSchema>({
    resolver: valibotResolver(RoomCreateSchema),
  });

  const onSubmit: SubmitHandler<RoomInputCreateSchema> = async ({
    name,
    price,
  }) => {
    const room = await createRoom.mutate({ name, price });
    notifications.show({
      message: t("roomsPage.roomCreated"),
      color: "green",
    });
    router.push(`/rooms/${room.id}`);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            title={[
              { label: t("dashboardLayout.rooms"), href: "/rooms" },
              { label: t("common.new") },
            ]}
          >
            <Button type="submit" leftSection={<IconPlus />}>
              {t("common.create")}
            </Button>
          </DashboardHeader>
          <Paper p="md">
            <RoomForm />
          </Paper>
        </Stack>
      </form>
    </FormProvider>
  );
}
