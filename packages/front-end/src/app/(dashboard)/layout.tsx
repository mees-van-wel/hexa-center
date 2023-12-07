"use client";

// export const runtime = "edge";

import "@mantine/core/styles.css";

import { Group, Stack, Paper, Drawer } from "@mantine/core";
import Image from "next/image";
import background from "@/assets/images/bg.jpeg";
import styles from "./page.module.scss"
import { useState } from "react";
import Navigation from "@/components/Pages/Dashboard/Navigation/Navigation";
import { IconDotsVertical } from "@tabler/icons-react";
import CompanyTitle from "@/components/Pages/Dashboard/CompanyTitle/CompanyTitle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  
  return (
    <>
      <Image
        alt="Background"
        src={background}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        className={styles.background}
      />
      <Drawer.Root opened={opened} onClose={() => {setOpened(false)}}>
      <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <CompanyTitle />
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body className={styles.mobileNav}>
            <Navigation />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      <Group align="stretch" className={styles.layoutContainer}>
        <Group hiddenFrom="md" className={styles.MobileMenuContainer}>
          <span className={styles.MobileMenu} onClick={() => setOpened(!opened)}>
            <IconDotsVertical />
          </span>
        </Group>
        <Paper visibleFrom="md" p="md">
          <Stack pos="relative" h="100%">
            <CompanyTitle />
            <Navigation />
          </Stack>
        </Paper>
          {children}
      </Group>
    </>
  );
}