"use client";

import { Fragment } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";

import { useAuthUser } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { routeHistoryState } from "@/states/routeHistoryState";
import { trpc } from "@/utils/trpc";
import {
  Avatar,
  Button,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconChevronRight,
  IconLogout,
  IconPalette,
  IconUser,
} from "@tabler/icons-react";

import styles from "./DashboardHeader.module.scss";

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
  const authUser = useAuthUser();
  const routeHistory = useRecoilValue(routeHistoryState);
  const previousRoute = routeHistory.at(-2);
  const showBackButton =
    !!(previousRoute !== pathName && previousRoute) || !!backRouteFallback;

  const logoutHandler = async () => {
    await trpc.auth.logout.mutate();
    router.replace("/login");
  };

  return (
    <Group w="100%" align="stretch" wrap="nowrap">
      {(children || showBackButton) && (
        <Paper component={Group} p="md" wrap="nowrap">
          {showBackButton && (
            <Button
              variant="light"
              leftSection={<IconArrowLeft />}
              onClick={() => {
                previousRoute
                  ? router.back()
                  : backRouteFallback && router.push(backRouteFallback);
              }}
            >
              {t("common.back")}
            </Button>
          )}
          {children}
        </Paper>
      )}
      <Paper
        className={styles.titleContainer}
        component={Group}
        wrap="nowrap"
        justify="center"
        gap="xs"
        p="md"
      >
        {title.map(({ icon, label, href }, index) => {
          const isLast = title.length - 1 === index;
          const labelComponent = (
            <Title
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              order={3}
            >
              {label}
            </Title>
          );

          return (
            <Fragment key={index}>
              <Group gap="xs" wrap="nowrap" maw="44vw">
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
            </Fragment>
          );
        })}
      </Paper>
      <Paper component={Menu} trigger="hover" position="bottom-end" p="md">
        <Menu.Target>
          <Group wrap="nowrap">
            <Stack ta="right" visibleFrom="md" gap={0}>
              <Text
                size="xs"
                fw={700}
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {authUser.firstName} {authUser.lastName}
              </Text>
              <Text
                size="xs"
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {authUser.email}
              </Text>
            </Stack>
            <Avatar />
          </Group>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconUser />}
            component={Link}
            href="/profile"
          >
            {t("dashboardLayout.avatar.profile")}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconPalette />}
            component={Link}
            href="/preferences"
          >
            {t("dashboardLayout.avatar.preferences")}
          </Menu.Item>
          <Menu.Item leftSection={<IconLogout />} onClick={logoutHandler}>
            {t("dashboardLayout.avatar.logout")}
          </Menu.Item>
        </Menu.Dropdown>
      </Paper>
    </Group>
  );
};
