import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Stack, Title } from "@mantine/core";
import {
  IconBed,
  IconBuilding,
  IconHome,
  IconHotelService,
  IconLock,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import styles from "./Navigation.module.scss";

export default function Navigation() {
  const t = useTranslation();
  const url = usePathname();
  const pathname = useMemo(() => `/${url.split("/")[1]}`, [url]);

  return (
    <Stack pos="relative" h="100%">
      <nav>
        <Stack>
          <Button
            component={Link}
            href={ROUTES.HOME}
            variant={pathname === ROUTES.HOME ? "filled" : "subtle"}
            leftSection={<IconHome />}
            fullWidth
            justify="left"
          >
            {t("dashboardLayout.home")}
          </Button>
          <Stack gap="xs">
            <Title order={4}>{t("dashboardLayout.titles.essentials")}</Title>
            <Stack gap={0}>
              <Button
                component={Link}
                href={ROUTES.PROPERTIES}
                variant={pathname === ROUTES.PROPERTIES ? "filled" : "subtle"}
                leftSection={<IconBuilding />}
                fullWidth
                justify="left"
              >
                {t("dashboardLayout.properties")}
              </Button>
              <Button
                component={Link}
                href={ROUTES.ROLES}
                variant={pathname === ROUTES.ROLES ? "filled" : "subtle"}
                leftSection={<IconLock />}
                fullWidth
                justify="left"
              >
                {t("dashboardLayout.roles")}
              </Button>
              <Button
                component={Link}
                href={ROUTES.USERS}
                variant={pathname === ROUTES.USERS ? "filled" : "subtle"}
                leftSection={<IconUser />}
                fullWidth
                justify="left"
              >
                {t("dashboardLayout.users")}
              </Button>
            </Stack>
          </Stack>
          <Stack gap="xs">
            <Title order={4}>{t("dashboardLayout.titles.bookings")}</Title>
            <Stack gap={0}>
              <Button
                component={Link}
                href={ROUTES.RESERVATIONS}
                variant={pathname === ROUTES.RESERVATIONS ? "filled" : "subtle"}
                leftSection={<IconHotelService />}
                fullWidth
                justify="left"
              >
                {t("dashboardLayout.reservations")}
              </Button>
              <Button
                component={Link}
                href={ROUTES.ROOMS}
                variant={pathname === ROUTES.ROOMS ? "filled" : "subtle"}
                leftSection={<IconBed />}
                fullWidth
                justify="left"
              >
                {t("dashboardLayout.rooms")}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </nav>
      <div className={styles.version}>V1.3.0 (Blue Heron)</div>
    </Stack>
  );
}
