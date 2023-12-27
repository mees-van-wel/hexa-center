"use client";

import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";
import { RoomInputUpdateSchema, RoomUpdateSchema } from "@/schemas/room";
import { RouterOutput } from "@/utils/trpc";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconTrash } from "@tabler/icons-react";

import { RoomForm } from "./RoomForm";

type RoomProps = {
  room: RouterOutput["room"]["get"];
};

export const Room = ({ room }: RoomProps) => {
  const t = useTranslation();
  const router = useRouter();
  const updateRoom = useMutation("room", "update");
  const deleteRoom = useMutation("room", "delete");

  const methods = useForm<RoomInputUpdateSchema>({
    defaultValues: {
      id: room.id,
      name: room.name,
      price: room.price,
    },
    resolver: valibotResolver(RoomUpdateSchema),
  });

  const { handleSubmit, reset, formState } = methods;

  const onSubmit: SubmitHandler<RoomInputUpdateSchema> = async ({
    name,
    price,
  }) => {
    await updateRoom.mutate({ id: room.id, name, price });
    reset({ id: room.id, name, price });
  };

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      children: <div>{t("roomsPage.confirmDeleteModal")}</div>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: onDelete,
    });
  };

  const onDelete = async () => {
    await deleteRoom.mutate(room.id);
    notifications.show({
      message: t("roomsPage.roomDeleted"),
      color: "green",
    });
    router.push("/rooms");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/rooms"
            title={[
              { label: t("dashboardLayout.rooms"), href: "/rooms" },
              { label: room.name },
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
              onClick={() => {
                deletehandler();
              }}
              leftSection={<IconTrash />}
            >
              {t("common.delete")}
            </Button>
            <Badge
              size="lg"
              variant="light"
              color={updateRoom.loading ? "orange" : "green"}
              leftSection={<IconCheck size="1rem" />}
            >
              {updateRoom.loading ? t("common.saving") : t("common.saved")}
            </Badge>
          </DashboardHeader>
          <Paper p="md">
            <RoomForm />
          </Paper>
        </Stack>
      </form>
    </FormProvider>
  );
};
