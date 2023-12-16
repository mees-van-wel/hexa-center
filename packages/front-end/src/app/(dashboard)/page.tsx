"use client";

import { Badge, Button, Paper, Stack, Title } from "@mantine/core";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { Table } from "@/components/common/Table";

export default function Page() {
  const t = useTranslation();

  return (
    <Stack h="100%">
      <DashboardHeader title={[{ label: "Home" }]}>
        <Button>{t("common.create")}</Button>
        <Badge size="lg" color="green">
          {t("common.saved")}
        </Badge>
        <Table.SearchBar />
      </DashboardHeader>
      <Paper p="md">
        <Title>Content</Title>
      </Paper>
    </Stack>
  );
}
