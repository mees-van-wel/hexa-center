"use client";

import { Badge, Button, Group, Paper, Stack, Title } from "@mantine/core";
import styles from "./page.module.scss";
import { DashboardHeader } from "@/components/Pages/Dashboard/DashboardHeader/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const t = useTranslation();

  return (
    <main className={styles.main}>
      <Stack h={"100%"}>
        <DashboardHeader title={[{ content: "Home", href: "" }]}>
          <Group>
            <Button>{t("common.create")}</Button>
            <Badge size="lg" color="green">
              {t("common.saved")}
            </Badge>
          </Group>
        </DashboardHeader>
        <Paper h={"100%"} p={"md"}>
          <Title>Content</Title>
        </Paper>
      </Stack>
    </main>
  );
}
