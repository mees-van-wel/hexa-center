"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useWrite } from "@/hooks/useWrite";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  Button,
  Group,
  NumberInput,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "valibot";
import { RoomCreateSchema } from "@hexa-center/shared/schemas/roomCreate";

type RoomInputSchema = Input<typeof RoomCreateSchema>;

export default function RoomNew() {
  const t = useTranslation();
  const router = useRouter();
  const sendRoom = useWrite("POST", "/rooms");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RoomInputSchema>({
    resolver: valibotResolver(RoomCreateSchema),
  });

  const onSubmit: SubmitHandler<RoomInputSchema> = async ({ name, price }) => {
    const response = await sendRoom.execute({ name, price });
    if (response && response.id) {
      router.push(`/rooms/${response.id}`);
    } else router.push("/rooms");
  };

  return (
    <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
      <Paper p="md">
        <Group>
          <Button type="submit">{t("common.create")}</Button>
        </Group>
        <Stack>
          <TextInput
            {...register("name")}
            error={errors.name?.message}
            label="Name"
          />
          {/* TODO: use number input */}
          <TextInput
            {...register("price")}
            error={errors.price?.message}
            label="Price per night"
          />
        </Stack>
      </Paper>
    </form>
  );
}
