"use client";

import { Group, Stack, Paper, Drawer } from "@mantine/core";
import Image from "next/image";
import background from "@/assets/images/bg.jpeg";
import styles from "./layout.module.scss";
import { useState } from "react";
import { Navigation } from "@/components/layouts/Dashboard/Navigation";
import { IconDotsVertical } from "@tabler/icons-react";
import { CompanyTitle } from "@/components/layouts/Dashboard/CompanyTitle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <Drawer.Root
        opened={mobileMenuOpen}
        onClose={() => {
          setMobileMenuOpen(false);
        }}
      >
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
        <div className={styles.mobileMenuContainer}>
          <span
            className={styles.mobileMenu}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <IconDotsVertical />
          </span>
        </div>
        <Paper
          component={Stack}
          pos="relative"
          h="100%"
          visibleFrom="md"
          p="md"
        >
          <CompanyTitle />
          <Navigation />
        </Paper>
        <main className={styles.main}>{children}</main>
      </Group>
    </>
  );
}
