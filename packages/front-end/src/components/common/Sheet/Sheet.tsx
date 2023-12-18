"use client";

import { ReactNode, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Card, Group, Paper, Stack, Title } from "@mantine/core";
import styles from "./Sheet.module.scss";

interface SheetProps {
  title: string;
  showDefault?: boolean;
  children?: ReactNode;
}

export default function Sheet({ title, showDefault, children }: SheetProps) {
  const t = useTranslation();
  const [show, setShow] = useState(false);
  const wrapper = !show ? styles.header : styles.headerClosed;

  return (
    <Stack gap={0}>
      <div className={styles.headerContent}>
        <Paper className={wrapper}>
          <Group>
            <Title order={3}>{title}</Title>
            {showDefault && (
              <Button
                size="xs"
                variant="light"
                leftSection={
                  !show ? <IconEyeOff size={16} /> : <IconEye size={16} />
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
      </div>
      {!show && (
        <Paper className={styles.content}>
          <Group>{children}</Group>
        </Paper>
      )}
    </Stack>
  );
}
