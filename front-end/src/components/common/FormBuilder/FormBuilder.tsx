"use client";

import { Group, Paper } from "@mantine/core";
import { useState } from "react";

import graphPaper from "@/assets/images/graph-paper.svg";
import { useQuery } from "@/hooks/useQuery";

import { Loading } from "../Loading";
import { Canvas } from "./Canvas";
import styles from "./FormBuilder.module.scss";
import { FormBuilderContext } from "./FormBuilderContext";
import { Properties } from "./Properties";
import { Sidebar } from "./Sidebar";
import { Form } from "./types";

type FormBuilderProps = {
  formId: number;
};

export const FormBuilder = ({ formId }: FormBuilderProps) => {
  const getForm = useQuery("form", "get", { initialParams: formId });

  if (getForm.loading || !getForm.data) return <Loading />;

  return <Component form={getForm.data} />;
};

type ComponentProps = {
  form: Form;
};

const Component = ({ form }: ComponentProps) => {
  const [currentElementId, setCurrentElementId] = useState(
    form.sections[0]?.elements[0]?.id,
  );

  return (
    <FormBuilderContext.Provider
      value={{ form, currentElementId, setCurrentElementId }}
    >
      <Paper className={styles.root}>
        <div
          className={styles.background}
          style={{
            backgroundImage: `url(${graphPaper.src})`,
          }}
        />
        <Group w="100%" h="100%" align="center" justify="space-around">
          <Sidebar />
          <Canvas />
          <Properties />
        </Group>
      </Paper>
    </FormBuilderContext.Provider>
  );
};
