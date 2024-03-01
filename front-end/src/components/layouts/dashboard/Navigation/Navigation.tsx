import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";
import { Button, Stack, Title } from "@mantine/core";
import {
  IconBed,
  IconFileEuro,
  IconHome,
  IconHotelService,
  IconUsers,
} from "@tabler/icons-react";

import styles from "./Navigation.module.scss";

export const Navigation = () => {
  const t = useTranslation();
  const url = usePathname();
  const pathname = useMemo(() => `/${url.split("/")[1]}`, [url]);

  return (
    <Stack pos="relative" h="100%">
      <nav>
        <Stack>
          <Button
            component={Link}
            href="/"
            variant={pathname === "/" ? "filled" : "subtle"}
            leftSection={<IconHome />}
            fullWidth
            justify="left"
          >
            {t("dashboardLayout.home")}
          </Button>
          <Stack gap="xs">
            <Title order={4}>{t("modules.essentials")}</Title>
            <Stack gap={0}>
              {/* <Button
                component={Link}
                href="/properties"
                variant={pathname === "/properties" ? "filled" : "subtle"}
                leftSection={<IconBuilding />}
                fullWidth
                justify="left"
              >
                {t("dashboardLayout.properties")}
              </Button>
              <Button
                component={Link}
                href="/roles"
                variant={pathname === "/roles" ? "filled" : "subtle"}
                leftSection={<IconLock />}
                fullWidth
                justify="left"
              >
                {t("dashboardLayout.roles")}
              </Button> */}
              <Button
                component={Link}
                href="/relations"
                variant={pathname === "/relations" ? "filled" : "subtle"}
                leftSection={<IconUsers />}
                fullWidth
                justify="left"
              >
                {t("entities.relation.name.plural")}
              </Button>
            </Stack>
          </Stack>
          <Stack gap="xs">
            <Title order={4}>{t("modules.bookings")}</Title>
            <Stack gap={0}>
              <Button
                component={Link}
                href="/reservations"
                variant={pathname === "/reservations" ? "filled" : "subtle"}
                leftSection={<IconHotelService />}
                fullWidth
                justify="left"
              >
                {t("dashboardLayout.reservations")}
              </Button>
              <Button
                component={Link}
                href="/rooms"
                variant={pathname === "/rooms" ? "filled" : "subtle"}
                leftSection={<IconBed />}
                fullWidth
                justify="left"
              >
                {t("dashboardLayout.rooms")}
              </Button>
            </Stack>
          </Stack>
          <Stack gap="xs">
            <Title order={4}>{t("modules.sales")}</Title>
            <Stack gap={0}>
              <Button
                component={Link}
                href="/invoices"
                variant={pathname === "/invoices" ? "filled" : "subtle"}
                leftSection={<IconFileEuro />}
                fullWidth
                justify="left"
              >
                {t("entities.invoice.pluralName")}
              </Button>
            </Stack>
          </Stack>
          <Stack gap="xs">
            <Title order={4}>{t("modules.system")}</Title>
            <Stack gap={0}>
              <Button
                component={Link}
                href="/invoices"
                variant={pathname === "/invoices" ? "filled" : "subtle"}
                leftSection={<IconFileEuro />}
                fullWidth
                justify="left"
              >
                {t("entities.invoice.pluralName")}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </nav>
      <div className={styles.version}>V1.3.0 (Blue Heron)</div>
    </Stack>
  );
};
