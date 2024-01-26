import clsx from "clsx";

import { BandGroup } from "./BandGroup";

import styles from "./Band.module.scss";

type BandProps = {
  children: React.ReactNode;
  title?: React.ReactNode;
  secondTitle?: React.ReactNode;
  fh?: boolean;
};

export const Band = ({ children, title, secondTitle, fh }: BandProps) => {
  return (
    <div
      className={clsx(styles.root, {
        [styles.rootFullHeight]: fh,
      })}
    >
      {title && <div className={styles.titleWrapper}>{title}</div>}
      {title && <div className={styles.secondTitleWrapper}>{secondTitle}</div>}
      {children}
    </div>
  );
};

Band.Group = BandGroup;
