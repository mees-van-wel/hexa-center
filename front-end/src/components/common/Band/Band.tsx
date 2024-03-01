import clsx from "clsx";

import { BandGroup } from "./BandGroup";

import styles from "./Band.module.scss";

type BandProps = {
  children: React.ReactNode;
  title?: React.ReactNode;
  fh?: boolean;
};

export const Band = ({ children, title, fh }: BandProps) => {
  return (
    <div
      className={clsx(styles.root, {
        [styles.rootFullHeight]: fh,
      })}
    >
      {title && (
        <div className={styles.titleWrapper}>
          <div className={styles.headerContent}>{title}</div>
          <span className={styles.line} />
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

Band.Group = BandGroup;
