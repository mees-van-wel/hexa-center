"use client";

import { Button, Group, Paper, Title } from "@mantine/core";
import styles from "./DashboardHeader.module.scss";
import { CustomAvatar } from "../ContextMenu";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { routeHistoryState } from "@/states/routeHistoryState";

type DashboardHeaderProps = {
  children?: React.ReactNode;
  title: {
    label: string;
    href?: Route;
    icon?: React.ReactNode;
  }[];
  backRouteFallback?: Route;
};

export const DashboardHeader = ({
  children,
  title,
  backRouteFallback,
}: DashboardHeaderProps) => {
  const t = useTranslation();
  const router = useRouter();
  const pathName = usePathname();
  const routeHistory = useRecoilValue(routeHistoryState);
  const previousRoute = routeHistory.at(-2);
  const showBackButton =
    !!(previousRoute !== pathName && previousRoute) || !!backRouteFallback;

  return (
    <Group align="stretch">
      <Paper p="md" className={styles.headerChildren}>
        <Group>
          {showBackButton && (
            <Button
              leftSection={<IconArrowLeft />}
              onClick={() => {
                backRouteFallback
                  ? router.push(backRouteFallback)
                  : router.back();
              }}
            >
              {t("common.back")}
            </Button>
          )}
          {children}
        </Group>
      </Paper>
      <Paper className={styles.dashboardcontainer} p="md">
        <Group justify="space-between" wrap="nowrap">
          <span />
          <Group align="center" gap="xs">
            {title.map(({ icon, label, href }, index) => {
              const isLast = title.length - 1 === index;
              const labelComponent = <Title order={3}>{label}</Title>;

              return (
                <>
                  <Group key={label} gap="xs">
                    {icon}
                    {href ? (
                      <Link className={styles.dashboardHeaderLink} href={href}>
                        {labelComponent}
                      </Link>
                    ) : (
                      labelComponent
                    )}
                  </Group>
                  {!isLast && <IconChevronRight />}
                </>
              );
            })}
          </Group>
          <CustomAvatar />
        </Group>
      </Paper>
    </Group>
  );
};
