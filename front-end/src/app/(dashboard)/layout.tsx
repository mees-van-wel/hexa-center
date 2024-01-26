"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRecoilState } from "recoil";

import { CompanyTitle } from "@/components/layouts/dashboard/CompanyTitle";
import { Navigation } from "@/components/layouts/dashboard/Navigation";
import { routeHistoryState } from "@/states/routeHistoryState";
import { Drawer, Group, Paper, Stack } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";

import styles from "./layout.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [routeHistory, setRouteHistory] = useRecoilState(routeHistoryState);

  useEffect(() => {
    setRouteHistory([...routeHistory, pathname]);
  }, [pathname]);

  useEffect(() => {
    if (!window.localStorage.getItem("fade")) return;

    const timer = setTimeout(() => {
      window.localStorage.removeItem("fade");
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* <Image
        suppressHydrationWarning
        className={styles.background}
        placeholder="blur"
        alt="Background"
        src={background}
        quality={100}
        sizes="100vw"
        fill
      /> */}
      <div
        className={
          typeof window !== "undefined" && window.localStorage.getItem("fade")
            ? styles.fade
            : undefined
        }
      >
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
        <Group align="stretch" className={styles.layoutContainer} wrap="nowrap">
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
            style={{ flexShrink: 0 }}
          >
            <CompanyTitle />
            <Navigation />
          </Paper>
          <main className={styles.main}>{children}</main>
        </Group>
      </div>
    </>
  );
}
