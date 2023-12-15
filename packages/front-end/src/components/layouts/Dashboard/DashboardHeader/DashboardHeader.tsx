"use client";

import { Button, Group, Paper, Title } from "@mantine/core";
import styles from "./DashboardHeader.module.scss";
import { CustomAvatar } from "../ContextMenu";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { routeHistoryState } from "@/states/routeHistoryState";

type DashboardHeaderProps = {
  children?: React.ReactNode;
  title: {
    content: string;
    href?: Route;
  }[];
  icon?: React.ReactNode;
  backRouteFallback?: Route;
};

export const DashboardHeader = ({
  children,
  title,
  icon,
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
          <span>&nbsp;</span>
          <Group justify="center" gap="xs">
            {icon && icon}
            {title.map(({ content, href }, index) => {
              const isLast = title.length - 1 === index;

              return (
                <Group key={content} gap="xs">
                  {href ? (
                    <Link className={styles.dashboardHeaderLink} href={href}>
                      {content}
                    </Link>
                  ) : (
                    <Title className={styles.dashboardHeaderTitle} order={2}>
                      {content}
                    </Title>
                  )}
                  {!isLast && <IconChevronRight />}
                </Group>
              );
            })}
          </Group>
          <CustomAvatar />
        </Group>
      </Paper>
    </Group>
  );
};
