import { Progress } from "@mantine/core";
import styles from "./AuthProgress.module.scss";

type AuthProgressOProps = {
  value: number;
};

export const AuthProgress = ({ value }: AuthProgressOProps) => (
  <div className={styles.root}>
    <Progress value={value} size={5} className={styles.progress} />
  </div>
);
