"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { DashboardHeader } from "@/components/layouts/Dashboard/DashboardHeader";
import { Badge, Button, Paper, Stack } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  RoomInputUpdateSchema,
  RoomUpdateSchema,
} from "@hexa-center/shared/schemas/room";
import { useMutation } from "@/hooks/useMutation";
import { RoomsForm } from "./RoomsForm";
import { RouterOutput } from "@/utils/trpc";

type RoomProps = {
  data: RouterOutput["room"]["get"];
};

export const Room = ({ data }: RoomProps) => {
  const t = useTranslation();
  const updateRoom = useMutation("room", "update");

  const methods = useForm<RoomInputUpdateSchema>({
    defaultValues: {
      id: 123,
    },
    resolver: valibotResolver(RoomUpdateSchema),
  });

  const onSubmit: SubmitHandler<RoomInputUpdateSchema> = ({ name, price }) => {
    updateRoom.mutate({ id: data.id, name, price });
  };

  return (
    <FormProvider {...methods}>
      <form autoComplete="on" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack>
          <DashboardHeader
            backRouteFallback="/rooms"
            title={[{ content: "Room" }]}
          >
            <Button type="submit" leftSection={<IconDeviceFloppy />}>
              {t("common.save")}
            </Button>
            <Badge color={updateRoom.loading ? "orange" : "green"}>
              {updateRoom.loading ? t("common.saving") : t("common.saved")}
            </Badge>
          </DashboardHeader>
          <Paper p={"1rem"}>
            <RoomsForm initialValues={data} />
          </Paper>
        </Stack>
      </form>
    </FormProvider>
  );
};
