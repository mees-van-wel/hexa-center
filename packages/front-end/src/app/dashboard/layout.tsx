"use client";

// export const runtime = "edge";

import "@mantine/core/styles.css";

import { Group, Stack, Paper, Popover, Title, Button } from "@mantine/core";
import Image from "next/image";
import Icon from "@/assets/images/icon-white.svg"
import background from "@/assets/images/bg.jpeg";
import CustomAvatar from "@/components/CustomAvatar";
import styles from "./page.module.scss"
import { IconBed, IconBuilding, IconHome, IconHotelService, IconLock, IconUser } from "@tabler/icons-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useMemo } from "react";
import { usePathname } from 'next/navigation';
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslation();
  const url = usePathname();
  const pathname = useMemo(() => `/${url.split("/")[1]}`, [url]);
  
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
        <Paper p="md">
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
            <nav style={{overflow: "auto"}}>
              <Stack>
                {/* TODO: rempve dashboard from url */}
                <Link href={ROUTES.HOME}>
                  <Button variant={pathname === "/dashboard" ? "filled" : "subtle"} leftSection={<IconHome />} fullWidth justify="left">
                    Home
                  </Button>
                </Link>
                <Stack gap="xs">
                  <Title order={4}>
                    Essentials
                  </Title>
                  <Stack>
                    <Link href={ROUTES.PROPERTIES}>
                      <Button variant={pathname === ROUTES.PROPERTIES ? "filled" : "subtle"} leftSection={<IconBuilding />} fullWidth justify="left">
                        Properties
                      </Button>
                    </Link>
                    <Link href={ROUTES.ROLES}>
                      <Button variant={pathname === ROUTES.ROLES ? "filled" : "subtle"} leftSection={<IconLock />} fullWidth justify="left">
                        Roles
                      </Button>
                    </Link>
                    <Link href={ROUTES.USERS}>
                      <Button variant={pathname === ROUTES.USERS ? "filled" : "subtle"} leftSection={<IconUser />} fullWidth justify="left">
                        Users
                      </Button>
                    </Link>
                  </Stack>
                </Stack>
                <Stack gap="xs">
                  <Title order={4}>
                    Bookings
                  </Title>
                  <Stack>
                    <Link href={ROUTES.RESERVATIONS}>
                      <Button variant={pathname === ROUTES.RESERVATIONS ? "filled" : "subtle"} leftSection={<IconHotelService />} fullWidth justify="left">
                        Reservations
                      </Button>
                    </Link>
                    <Link href={ROUTES.ROOMS}>
                      <Button variant={pathname === ROUTES.ROOMS ? "filled" : "subtle"} leftSection={<IconBed />} fullWidth justify="left">
                        Rooms
                      </Button>
                    </Link>
                  </Stack>
                </Stack>
              </Stack>
            </nav>
            <div className={styles.version}>V1.3.0 (Blue Heron)</div>
          </Stack>
        </Paper>
        <Stack style={{flex: "1 1 0%"}}>
          <Group style={{flexWrap: "nowrap"}}>
            <Paper p="md">
              <Button>
                Create
              </Button>
            </Paper>
            <Paper p="md" style={{flex: "1 1 0%"}}>
              <Group justify="space-between" align="center">
                &nbsp;
                <Group justify="center">
                  {/* {title.map(({ content, href }, index) => {
                  const isLast = title.length - 1 === index;
                  const Component = href ? Link : "div"; */}

                  {/* return ( */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Title order={2}>Home</Title>
                      {/* {!isLast && <Title size={4}>&#x203A;</Title>} */}
                    </div>
                  {/* );
                  })} */}
                </Group>
                <CustomAvatar />
              </Group>
            </Paper>
          </Group>
          <main style={{flex: "1 1 0%", margin: "1rem"}}>
            {children}
          </main>
        </Stack>
      </Group>
    </>
  );
}
