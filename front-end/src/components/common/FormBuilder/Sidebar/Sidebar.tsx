import { Paper } from "@mantine/core";

import { formElements } from "../elements";
import styles from "./Sidebar.module.scss";

export const Sidebar = () => (
  <Paper className={styles.root}>
    {Object.keys(formElements).map((key) => {
      const Icon = formElements[key as keyof typeof formElements].icon;

      return (
        <div
          key={key}
          className={styles.item}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData("type", key);
          }}
        >
          <Icon />
          <p>{key}</p>
        </div>
      );
    })}
  </Paper>
);
