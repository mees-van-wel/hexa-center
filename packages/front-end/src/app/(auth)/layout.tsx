"use client";

import Image from "next/image";
import Link from "next/link";
import background from "@/assets/images/bg.jpeg";
import icon from "@/assets/images/icon-white.svg";
import styles from "./layout.module.scss";
import { Button, Group, Stack, Title } from "@mantine/core";
import { useCompanyName } from "@/hooks/useCompanyName";
import { IconQuestionMark } from "@tabler/icons-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const companyName = useCompanyName();
  const t = useTranslation();

  return (
    <main className={styles.main}>
      <aside className={styles.aside}>
        <Group wrap="nowrap" w="100%">
          <Image alt="Icon" src={icon} width={64} height={64} />
          <Stack gap={0} className={styles.nameWrapper}>
            <Title>Hexa Center</Title>
            {companyName && <Title order={6}>{companyName}</Title>}
          </Stack>
        </Group>
        <div className={styles.content}>{children}</div>
        <Stack align="center">
          <Button
            component={Link}
            variant="light"
            leftSection={<IconQuestionMark size={16} />}
            size="sm"
            href="https://www.hexa.center/guide/system/login/"
            target="_blank"
          >
            {t("authLayout.help")}
          </Button>
          <p>{t("authLayout.version")} 1.3.0 (Blue Heron)</p>
        </Stack>
      </aside>
      <div className={styles.backgroundWrapper}>
        <Image
          className={styles.background}
          placeholder="blur"
          alt="Background"
          src={background}
          quality={100}
          fill
          priority
        />
        <div className={styles.gradient} />
      </div>
    </main>
  );
}
