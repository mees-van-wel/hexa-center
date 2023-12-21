"use client";

import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import styles from "./Sheet.module.scss";

interface SheetProps {
  title: string;
  showDefault?: boolean;
  children?: React.ReactNode;
}

export default function Sheet({ title, showDefault, children }: SheetProps) {
  const t = useTranslation();
  const [show, setShow] = useState(showDefault);

  return (
    <Stack gap={0} align="flex-start">
      <Paper className={`${show ? styles.header : undefined}`} p="md">
        <Group>
          <Title order={3}>{title}</Title>
          {showDefault && (
            <Button
              size="xs"
              variant="light"
              leftSection={
                show ? <IconEye size={16} /> : <IconEyeOff size={16} />
              }
              onClick={() => {
                setShow((prev) => !prev);
              }}
            >
              {show ? t("metadata.show") : t("metadata.hide")}
            </Button>
          )}
        </Group>
      </Paper>
      {show && <Paper className={styles.content}>{children}</Paper>}
    </Stack>
  );
}
