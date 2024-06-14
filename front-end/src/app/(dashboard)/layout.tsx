"use client";

import { Drawer, Group, Paper, Stack } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import clsx from "clsx";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import background from "@/assets/images/bg.jpeg";
import { CompanyTitle } from "@/components/layouts/dashboard/CompanyTitle";
import { Navigation } from "@/components/layouts/dashboard/Navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { routeHistoryState } from "@/states/routeHistoryState";

import styles from "./layout.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [routeHistory, setRouteHistory] = useRecoilState(routeHistoryState);
  const {
    auth: { iotd },
  } = useAuthContext();

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

  const isOnHome = useMemo(
    () => `/${pathname.split("/")[1]}` === "/",
    [pathname],
  );

  return (
    <>
      <Image
        suppressHydrationWarning
        className={clsx(styles.background, {
          [styles.backgroundBlur]: !isOnHome,
        })}
        placeholder={iotd ? undefined : "blur"}
        alt="Background"
        src={iotd?.url || background}
        quality={100}
        sizes="100vw"
        fill
      />
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
            mih="100%"
            visibleFrom="md"
            p="md"
            style={{ flexShrink: 0 }}
          >
            <CompanyTitle />
            <Navigation />
          </Paper>
          <main className={styles.main}>{children}</main>
          {isOnHome && (
            <p className={styles.copyright}>
              {iotd?.copyright || "Jan van Keulen"}
            </p>
          )}
        </Group>
      </div>
    </>
  );
}
