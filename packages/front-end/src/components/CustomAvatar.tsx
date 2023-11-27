"use client";

import { Avatar, Menu } from "@mantine/core";

export default function CustomAvatar() {
  return (
    <Menu trigger="hover">
      <Menu.Target>
        <Avatar />
      </Menu.Target>
        <Menu.Dropdown>
        <Menu.Item>
          Route Profile
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
