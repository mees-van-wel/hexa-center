import { Group, Title } from "@mantine/core";

import styles from "./AuthTitle.module.scss";

type AuthTitleProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export const AuthTitle = ({ children, icon }: AuthTitleProps) => (
  <Group className={styles.root} gap="xs" wrap="nowrap">
    <Title order={2} className={styles.title}>
      {children}
    </Title>
    {icon}
  </Group>
);
