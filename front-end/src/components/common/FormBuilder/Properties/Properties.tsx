import { Paper } from "@mantine/core";

import { useFormBuilderContext } from "../FormBuilderContext";
import styles from "./Properties.module.scss";

export const Properties = () => {
  const { currentElementId } = useFormBuilderContext();

  return (
    <Paper className={styles.root} p="md">
      {!currentElementId ? <p>Start building</p> : <p>{currentElementId}</p>}
    </Paper>
  );
};
