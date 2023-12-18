"use client";

import {
  Badge,
  Button,
  Card,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DashboardHeader } from "@/components/layouts/Dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import Sheet from "@/components/common/Sheet/Sheet";

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
    </Stack>
  );
}
