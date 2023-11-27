import { Group, Title } from "@mantine/core";
import type { ReactNode } from "react";
import styles from "./AuthTitle.module.scss";

type AuthTitleProps = {
  children: ReactNode;
  icon?: ReactNode;
};

export const AuthTitle = ({ children, icon }: AuthTitleProps) => (
  <Group className={styles.root} gap="xs">
    <Title order={2} className={styles.title}>
      {children}
    </Title>
    {icon}
  </Group>
);
