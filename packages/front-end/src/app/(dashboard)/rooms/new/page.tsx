"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { DashboardHeader } from "@/components/layouts/Dashboard/DashboardHeader";
import { Button, Paper, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  RoomInputCreateSchema,
  RoomCreateSchema,
} from "@hexa-center/shared/schemas/room";
import { useMutation } from "@/hooks/useMutation";
import { RoomForm } from "@/components/pages/rooms/RoomForm";
import { useRouter } from "next/navigation";

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
              { content: t("dashboardLayout.rooms"), href: "/rooms" },
              { content: t("common.new") },
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
