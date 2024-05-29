"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Badge, Button, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { RoomInputUpdateSchema, RoomUpdateSchema } from "@shared/schemas/room";
import {
  IconAlertTriangle,
  IconBed,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Loading } from "@/components/common/Loading";
import { Metadata } from "@/components/common/Metadata";
import { RoomForm } from "@/components/entities/room/RoomForm";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useAutosave } from "@/hooks/useAutosave";
import { useMemory } from "@/hooks/useMemory";
import { useMutation } from "@/hooks/useMutation";
import { useQuery } from "@/hooks/useQuery";
import { useTranslation } from "@/hooks/useTranslation";
import { RouterOutput } from "@/utils/trpc";

type RoomPageParams = { params: { id: string } };

export default function Page({ params }: RoomPageParams) {
  const getRoom = useQuery("room", "get", {
    initialParams: parseInt(params.id),
  });

  if (getRoom.loading || !getRoom.data) return <Loading />;

  return <Detail room={getRoom.data} />;
}

type DetailProps = {
  room: RouterOutput["room"]["get"];
};

const Detail = ({ room }: DetailProps) => {
  const deleteRoom = useMutation("room", "delete");
  const router = useRouter();
  const memory = useMemory();
  const t = useTranslation();

  const formMethods = useForm({
    defaultValues: room,
    resolver: valibotResolver(RoomUpdateSchema),
  });

  const deletehandler = () => {
    modals.openConfirmModal({
      title: t("common.areYouSure"),
      labels: { confirm: t("common.yes"), cancel: t("common.no") },
      onConfirm: async () => {
        await deleteRoom.mutate(room.id);

        memory.evict(room);

        notifications.show({
          message: t("entities.room.deletedNotification"),
          color: "green",
        });
        router.push("/rooms");
      },
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Stack>
        <DashboardHeader
          backRouteFallback="/rooms"
          title={[
            {
              icon: <IconBed />,
              label: t("entities.room.pluralName"),
              href: "/rooms",
            },
            { label: room.name },
          ]}
        >
          <Button
            variant="light"
            color="red"
            onClick={deletehandler}
            leftSection={<IconTrash />}
          >
            {t("common.delete")}
          </Button>
          <SaveBadge />
        </DashboardHeader>
        <RoomForm />
        <Metadata />
      </Stack>
    </FormProvider>
  );
};

const SaveBadge = () => {
  const updateRoom = useMutation("room", "update");
  const memory = useMemory();
  const t = useTranslation();

  const { control, getValues, reset, setError } =
    useFormContext<RoomInputUpdateSchema>();
  const { isDirty, errors } = useFormState({ control });
  const isError = useMemo(() => !!Object.keys(errors).length, [errors]);

  useAutosave(control, async (values) => {
    function isJson(str: string) {
      if (!str) return { success: false, json: undefined };

      try {
        return { success: true, json: JSON.parse(str) };
      } catch (e) {
        return { success: false, json: undefined };
      }
    }

    try {
      const updatedRoom = await updateRoom.mutate({
        ...values,
        id: getValues("id"),
      });

      memory.update(updatedRoom);
      reset(updatedRoom);
    } catch (error) {
      const { success, json } = isJson((error as any).message);
      if (!success) {
        notifications.show({
          message: t("common.oops"),
          color: "red",
        });

        reset();

        return;
      }

      const { exception, data } = json;

      if (exception === "DB_UNIQUE_CONSTRAINT") {
        setError(data.column, {
          message: `${t("entities.room.singularName")} - ${getValues(
            data.column,
          )} - ${data.column}`,
        });
      }
    }
  });

  return (
    <Badge
      size="lg"
      color={
        isError ? "red" : isDirty || updateRoom.loading ? "orange" : "green"
      }
      leftSection={
        isError ? (
          <IconAlertTriangle size="1rem" />
        ) : isDirty || updateRoom.loading ? (
          <Loader color="orange" variant="oval" size="1rem" />
        ) : (
          <IconCheck size="1rem" />
        )
      }
      variant="light"
    >
      {isError
        ? t("common.error")
        : isDirty || updateRoom.loading
          ? t("common.saving")
          : t("common.saved")}
    </Badge>
  );
};
