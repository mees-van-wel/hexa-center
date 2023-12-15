"use client";

import { useAuthUser } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { trpc } from "@/utils/trpc";
import { Avatar, Group, Menu, Stack } from "@mantine/core";
import { IconLogout, IconPalette, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const CustomAvatar = () => {
  const t = useTranslation();
  const authUser = useAuthUser();
  const router = useRouter();

  const logoutHandler = async () => {
    await trpc.auth.logout.mutate();
    router.replace("/login");
  };

  return (
    <Menu trigger="hover" position="bottom-end">
      <Menu.Target>
        <Group>
          <Stack ta="right" visibleFrom="md" gap={0}>
            <span>
              {authUser.firstName} {authUser.lastName}
            </span>
            <span>{authUser.email}</span>
          </Stack>
          <Avatar />
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconUser />} component={Link} href="/profile">
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
    </Menu>
  );
};
