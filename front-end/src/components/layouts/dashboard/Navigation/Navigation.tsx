import { Button, Stack, Title } from "@mantine/core";
import {
  IconBed,
  IconBuilding,
  IconFileEuro,
  IconHome,
  IconHotelService,
  IconPlugConnected,
  IconUserDollar,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { useTranslation } from "@/hooks/useTranslation";

import styles from "./Navigation.module.scss";

export const Navigation = () => {
  const t = useTranslation();
  const url = usePathname();
  const pathname = useMemo(() => `/${url.split("/")[1]}`, [url]);

  return (
    <Stack className={styles.navigationContainer}>
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
            {t("homePage.name")}
          </Button>
          <Stack gap="xs">
            <Title order={4}>{t("modules.essentials")}</Title>
            <Stack gap={0}>
              <Button
                component={Link}
                href="/users"
                variant={pathname === "/users" ? "filled" : "subtle"}
                leftSection={<IconUsers />}
                fullWidth
                justify="left"
              >
                {t("entities.user.pluralName")}
              </Button>
              {/* <Button 
                component={Link}
                href="/roles"
                variant={pathname === "/roles" ? "filled" : "subtle"}
                leftSection={<IconLock />}
                fullWidth
                justify="left"
              >
                {t("entities.roles.pluralName")}
              </Button> */}
              <Button
                component={Link}
                href="/businesses"
                variant={pathname === "/businesses" ? "filled" : "subtle"}
                leftSection={<IconBuilding />}
                fullWidth
                justify="left"
              >
                {t("entities.company.pluralName")}
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
                {t("entities.reservation.pluralName")}
              </Button>
              <Button
                component={Link}
                href="/rooms"
                variant={pathname === "/rooms" ? "filled" : "subtle"}
                leftSection={<IconBed />}
                fullWidth
                justify="left"
              >
                {t("entities.room.pluralName")}
              </Button>
            </Stack>
          </Stack>
          <Stack gap="xs">
            <Title order={4}>{t("modules.sales")}</Title>
            <Stack gap={0}>
              <Button
                component={Link}
                href="/customers"
                variant={pathname === "/customers" ? "filled" : "subtle"}
                leftSection={<IconUserDollar />}
                fullWidth
                justify="left"
              >
                {t("entities.customer.pluralName")}
              </Button>
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
                href="/integrations"
                variant={pathname === "/integrations" ? "filled" : "subtle"}
                leftSection={<IconPlugConnected />}
                fullWidth
                justify="left"
              >
                {t("screens.integrationsPage.pluralName")}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </nav>
      <div className={styles.version}>V1.3.0 (Blue Heron)</div>
    </Stack>
  );
};
