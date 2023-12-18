"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { DashboardHeader } from "@/components/layouts/Dashboard/DashboardHeader";
import { Badge, Button, Paper, Stack } from "@mantine/core";
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
  data: RouterOutput["room"]["get"];
};

export const Room = ({ data }: RoomProps) => {
  const t = useTranslation();
  const router = useRouter();
  const updateRoom = useMutation("room", "update");
  const deleteRoom = useMutation("room", "delete");

  const methods = useForm<RoomInputUpdateSchema>({
    defaultValues: {
      id: data.id,
    },
    resolver: valibotResolver(RoomUpdateSchema),
  });

  const onSubmit: SubmitHandler<RoomInputUpdateSchema> = ({ name, price }) => {
    updateRoom.mutate({ id: data.id, name, price });
  };

  const onDelete = () => {
    deleteRoom.mutate(data.id);
    router.push("/rooms");
  };

  return (
    <FormProvider {...methods}>
      <form autoComplete="on" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/rooms"
            title={[
              { content: t("roomsPage.rooms"), href: "/rooms" },
              { content: data.name },
            ]}
          >
            <Button type="submit" leftSection={<IconDeviceFloppy />}>
              {t("common.save")}
            </Button>
            <Button color="red" onClick={onDelete} leftSection={<IconTrash />}>
              {t("common.delete")}
            </Button>
            <Badge color={updateRoom.loading ? "orange" : "green"}>
              {updateRoom.loading ? t("common.saving") : t("common.saved")}
            </Badge>
          </DashboardHeader>
          <Paper p={"1rem"}>
            <RoomForm initialValues={data} />
          </Paper>
        </Stack>
      </form>
    </FormProvider>
  );
};
