"use client";

import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Card, Group, Paper, Stack, Title } from "@mantine/core";
// import styles from "./Sheet.module.scss";

interface SheetProps {
  title: string;
  showDefault?: boolean;
}

export default function Sheet({ title, showDefault }: SheetProps) {
  const t = useTranslation();
  const [show, setShow] = useState(false);

  return (
    <Stack gap={0}>
      <Card>
        <Group align="flex-start">
          <Title order={4}>{title}</Title>
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
      </Card>
      {!show && (
        <Card>
          <Group>
            <p>Test</p>
          </Group>
        </Card>
      )}
    </Stack>
  );
}
