import { Group } from "@mantine/core";

import styles from "./BandGroup.module.scss";

type BandGroupProps = {
  children: React.ReactNode;
};

export const BandGroup = ({ children }: BandGroupProps) => {
  return (
    <Group className={styles.root} gap={0} align="stretch">
      {children}
    </Group>
  );
};
