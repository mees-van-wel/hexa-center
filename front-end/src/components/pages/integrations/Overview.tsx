"use client";

import { Button, Indicator, Paper, Stack, Text } from "@mantine/core";
import { IconPlugConnected } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import twinfieldLogo from "@/assets/images/twinfield-logo.png";
import { DashboardHeader } from "@/components/layouts/dashboard/DashboardHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { type RouterOutput } from "@/utils/trpc";

import styles from "./Overview.module.scss";

type OverviewProps = {
  integrations: RouterOutput["integration"]["list"];
};

export const Overview = ({ integrations }: OverviewProps) => {
  const t = useTranslation();

  return (
    <Stack>
      <DashboardHeader
        title={[
          {
            label: t("screens.integrationsPage.pluralName"),
            icon: <IconPlugConnected />,
          },
        ]}
      />
      <Paper p="md">
        <Indicator
          inline
          position="top-start"
          size="1.5rem"
          color={
            integrations.some(({ type }) => type === "twinfield")
              ? "green"
              : "red"
          }
          styles={{
            indicator: {
              border: "solid 0.3rem rgb(var(--color-foreground))",
            },
          }}
        >
          <Stack className={styles.card}>
            <Image
              src={twinfieldLogo}
              height={70}
              width={250}
              alt="Twinfield"
              style={{
                objectFit: "contain",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
            />
            <Text fw={500} px="md">
              Twinfield Tax & Accounting
            </Text>
            <Button component={Link} fullWidth href="/integrations/twinfield">
              Details
            </Button>
          </Stack>
        </Indicator>
      </Paper>
    </Stack>
  );
};
