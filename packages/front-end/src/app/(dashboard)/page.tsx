"use client";

import { Badge, Button, Paper, Stack, Title } from "@mantine/core";
import { DashboardHeader } from "@/components/layouts/Dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const t = useTranslation();

  return (
    <Stack h="100%">
      <DashboardHeader title={[{ content: "Home" }]}>
        <Button>{t("common.create")}</Button>
        <Badge size="lg" color="green">
          {t("common.saved")}
        </Badge>
      </DashboardHeader>
      <Paper p="md">
        <Title>Content</Title>
      </Paper>
    </Stack>
  );
}
