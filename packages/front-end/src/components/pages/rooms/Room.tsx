"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { DashboardHeader } from "@/components/layouts/Dashboard/DashboardHeader";
import { Badge, Button, Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  RoomInputUpdateSchema,
  RoomUpdateSchema,
} from "@hexa-center/shared/schemas/room";
import { useMutation } from "@/hooks/useMutation";
import { RoomForm } from "./RoomForm";
import { RouterOutput } from "@/utils/trpc";
import { useRouter } from "next/navigation";

type RoomProps = {
  room: RouterOutput["room"]["get"];
};

export const Room = ({ room }: RoomProps) => {
  const t = useTranslation();
  const router = useRouter();
  const updateRoom = useMutation("room", "update");
  const deleteRoom = useMutation("room", "delete");

  const { handleSubmit, reset, formState, ...restFormMethods } =
    useForm<RoomInputUpdateSchema>({
      defaultValues: {
        id: room.id,
        name: room.name,
        price: room.price,
      },
      resolver: valibotResolver(RoomUpdateSchema),
    });

  const onSubmit: SubmitHandler<RoomInputUpdateSchema> = async ({
    name,
    price,
  }) => {
    await updateRoom.mutate({ id: room.id, name, price });
    reset({ id: room.id, name, price });
  };

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.deleteTitle"),
      children: <div>{t("roomsPage.deleteRoom")}</div>,
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
    <FormProvider
      reset={reset}
      formState={formState}
      handleSubmit={handleSubmit}
      {...restFormMethods}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/rooms"
            title={[
              { content: t("dashboardLayout.rooms"), href: "/rooms" },
              { content: room.name },
            ]}
          >
            {formState.isDirty && (
              <Button type="submit" leftSection={<IconDeviceFloppy />}>
                {t("common.save")}
              </Button>
            )}
            <Button
              color="red"
              onClick={deletehandler}
              leftSection={<IconTrash />}
            >
              {t("common.delete")}
            </Button>
            <Badge color={updateRoom.loading ? "orange" : "green"}>
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
