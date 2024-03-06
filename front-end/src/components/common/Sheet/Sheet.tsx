"use client";

import { useState } from "react";
import clsx from "clsx";

import { useTranslation } from "@/hooks/useTranslation";
import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import styles from "./Sheet.module.scss";

type SheetProps = {
  title: string;
  showDefault?: boolean;
  children?: React.ReactNode;
  glass?: boolean;
};

export const Sheet = ({ title, showDefault, children, glass }: SheetProps) => {
  const t = useTranslation();
  const [show, setShow] = useState(
    showDefault === undefined ? true : showDefault,
  );

  return (
    <Stack align="flex-start" gap={0}>
      <Paper
        className={clsx(styles.header, {
          [styles.headerOpen]: show,
          [styles.glass]: glass,
        })}
      >
        <Group gap={0}>
          <Title order={3} className={styles.title}>
            {title}
          </Title>
          {showDefault !== undefined && (
            <Button
              variant="light"
              className={styles.button}
              onClick={() => setShow((prev) => !prev)}
              leftSection={
                show ? <IconEyeOff size={16} /> : <IconEye size={16} />
              }
            >
              {show ? t("common.hide") : t("common.show")}
            </Button>
          )}
        </Group>
      </Paper>
      {show && (
        <Paper className={clsx(styles.content, { [styles.glass]: glass })}>
          {children}
        </Paper>
      )}
    </Stack>
  );
};
