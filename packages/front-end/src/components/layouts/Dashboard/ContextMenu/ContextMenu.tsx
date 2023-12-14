"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Avatar, Group, Menu, Stack } from "@mantine/core";
import { IconLogout, IconPalette, IconUser } from "@tabler/icons-react";
import Link from "next/link";

export const CustomAvatar = () => {
  const t = useTranslation();

  return (
    <Menu trigger="hover" position="bottom-end">
      <Menu.Target>
        <Group>
          <Stack ta="right" visibleFrom="md" gap={0}>
            {/* TODO: get profile data */}
            <span>Tony Kaufeld</span>
            <span>tony.kaufeld@hexa-it.nl</span>
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
        {/* TODO: Add logout logic */}
        <Menu.Item
          leftSection={<IconLogout />}
          onClick={() => {
            alert("Add logout logic");
          }}
        >
          {t("dashboardLayout.avatar.logout")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
