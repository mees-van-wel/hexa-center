import { Loader, Paper } from "@mantine/core";
import { useMemo } from "react";

import { formElements } from "../elements";
import { useFormBuilderContext } from "../FormBuilderContext";
import styles from "./Properties.module.scss";

export const Properties = () => {
  const { form, elements, currentElementId } = useFormBuilderContext();
  // const updateElement = useMutation("form", "updateElement");

  const currentElement = useMemo(
    () => form.sections[0]?.elements.find(({ id }) => id === currentElementId),
    [form, currentElementId],
  );

  const elementConfig = useMemo(
    () =>
      currentElement
        ? formElements[currentElement.config.type as keyof typeof formElements]
        : undefined,
    [currentElement],
  );

  return (
    <Paper className={styles.root} p="md">
      {!currentElementId ? (
        <p>Start building</p>
      ) : currentElementId === "loading" ? (
        <Loader />
      ) : elementConfig?.properties && currentElement ? (
        <elementConfig.properties
          config={currentElement.config}
          updateConfig={(config) => {
            // TODO Debounce
            console.log(config);
          }}
        />
      ) : (
        <p>{currentElementId}</p>
      )}
    </Paper>
  );
};
