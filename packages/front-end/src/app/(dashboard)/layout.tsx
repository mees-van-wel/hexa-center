"use client";

// export const runtime = "edge";

import "@mantine/core/styles.css";

import { Group, Stack, Paper, Popover, Title, Button, Burger } from "@mantine/core";
import Image from "next/image";
import Icon from "@/assets/images/icon-white.svg"
import background from "@/assets/images/bg.jpeg";
import CustomAvatar from "@/components/CustomAvatar";
import styles from "./page.module.scss"
import { IconBed, IconBuilding, IconHome, IconHotelService, IconLock, IconMenu, IconUser } from "@tabler/icons-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useMemo, useState } from "react";
import { usePathname } from 'next/navigation';
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslation();
  const url = usePathname();
  const pathname = useMemo(() => `/${url.split("/")[1]}`, [url]);
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
        loading="eager"
      />
      <Group align="stretch" className={styles.layoutContainer}>
        <Paper hiddenFrom="md" style={{height: "auto"}}>
          <Burger opened={opened} onClick={() => setOpened(!opened)} aria-label="Toggle navigation" />;
        </Paper>
        <Paper visibleFrom="md" p="md">
          <Stack pos="relative" h="100%">
            <Group justify="center" pb="md">
              <Image alt="Icon" src={Icon} width={64} height={64} />
              <Stack gap={0}>
                <Title order={1}>
                  Hexa Center
                </Title>
                <Title order={6}>
                  company name
                </Title>
              </Stack>
            </Group>
            {/* TODO: use visibleFrom for nav and add a modal nav with visibleFrom */}

            <nav style={{overflow: "auto"}}>
              <Stack>
                  <Button component={Link} href={ROUTES.HOME} variant={pathname === ROUTES.HOME ? "filled" : "subtle"} leftSection={<IconHome />} fullWidth justify="left">
                    {t("dashboardLayout.home")}
                  </Button>
                <Stack gap="xs">
                  <Title order={4}>
                    {t("dashboardLayout.titles.essentials")}
                  </Title>
                  <Stack gap={0}>
                    <Button component={Link} href={ROUTES.PROPERTIES} variant={pathname === ROUTES.PROPERTIES ? "filled" : "subtle"} leftSection={<IconBuilding />} fullWidth justify="left">
                      {t("dashboardLayout.properties")}
                    </Button>
                    <Button component={Link} href={ROUTES.ROLES} variant={pathname === ROUTES.ROLES ? "filled" : "subtle"} leftSection={<IconLock />} fullWidth justify="left">
                      {t("dashboardLayout.roles")}
                    </Button>
                    <Button component={Link} href={ROUTES.USERS} variant={pathname === ROUTES.USERS ? "filled" : "subtle"} leftSection={<IconUser />} fullWidth justify="left">
                      {t("dashboardLayout.users")}
                    </Button>
                  </Stack>
                </Stack>
                <Stack gap="xs">
                  <Title order={4}>
                  {t("dashboardLayout.titles.bookings")}
                  </Title>
                  <Stack gap={0}>
                    <Button component={Link} href={ROUTES.RESERVATIONS} variant={pathname === ROUTES.RESERVATIONS ? "filled" : "subtle"} leftSection={<IconHotelService />} fullWidth justify="left">
                      {t("dashboardLayout.reservations")}
                    </Button>
                    <Button component={Link} href={ROUTES.ROOMS} variant={pathname === ROUTES.ROOMS ? "filled" : "subtle"} leftSection={<IconBed />} fullWidth justify="left">
                      {t("dashboardLayout.rooms")}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </nav>
            <div className={styles.version}>V1.3.0 (Blue Heron)</div>
          </Stack>
        </Paper>
          {children}
      </Group>
    </>
  );
}
function useDisclosure(): [any, { toggle: any; }] {
  throw new Error("Function not implemented.");
}

