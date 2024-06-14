import { Paper } from "@mantine/core";

import { FormElements } from "../elements";
import styles from "./Sidebar.module.scss";

export const Sidebar = () => (
  <Paper className={styles.root}>
    {Object.keys(FormElements).map((key) => {
      const Icon = FormElements[key as keyof typeof FormElements].icon;

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
