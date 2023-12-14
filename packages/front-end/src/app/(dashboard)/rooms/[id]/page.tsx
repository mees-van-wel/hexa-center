"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Button, Group, Paper, Stack, TextInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

export default function RoomId() {
  const t = useTranslation();

  return (
    <Paper p="md">
      <Group>
        <Button>{t("common.create")}</Button>
        <Button leftSection={<IconTrash />} variant="light">
          {t("common.delete")}
        </Button>
      </Group>
      <Stack>
        <TextInput label="Name" />
        <TextInput label="Price per night" />
      </Stack>
    </Paper>
  );
}
