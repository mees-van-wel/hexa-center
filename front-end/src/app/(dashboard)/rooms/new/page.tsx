"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { RoomCreateSchema, RoomInputCreateSchema } from "@shared/schemas/room";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { RoomForm } from "@/components/entities/room/RoomForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useTranslation } from "@/hooks/useTranslation";

export default function Page() {
  const t = useTranslation();

  const formMethods = useForm<RoomInputCreateSchema>({
    resolver: valibotResolver(RoomCreateSchema),
    defaultValues: {
      name: "",
      price: undefined,
    },
  });

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          title={[
            { label: t("entities.room.pluralName"), href: "/rooms" },
            { label: t("common.new") },
          ]}
        >
          <SaveButton />
        </DashboardHeader>
        <RoomForm />
      </Stack>
    </FormProvider>
  );
}

const SaveButton = () => {
  const createRoom = useMutation("room", "create");
  const memory = useMemory();
  const router = useRouter();
  const t = useTranslation();

  const { control, handleSubmit } = useFormContext<RoomInputCreateSchema>();
  const { isDirty } = useFormState({ control });

  const submitHandler: SubmitHandler<RoomInputCreateSchema> = async (
    values,
  ) => {
    const response = await createRoom.mutate(values);

    memory.write(response, [
      {
        scope: "room",
        procedure: "get",
        params: response.id,
      },
      {
        scope: "room",
        procedure: "list",
        as: ({ current, result }) =>
          current ? [...current, result] : undefined,
      },
    ]);

    notifications.show({
      message: t("entities.room.createdNotification"),
      color: "green",
    });

    router.push(`/rooms/${response.id}`);
  };

  return (
    <Button
      onClick={handleSubmit(submitHandler)}
      leftSection={<IconDeviceFloppy />}
      disabled={!isDirty}
      loading={createRoom.loading}
    >
      {t("common.save")}
    </Button>
  );
};
