import { createContext, useContext } from "react";

import type { Element, Form } from "./types";

export const FormBuilderContext = createContext<{
  form: Form;
  elements: Element[];
  currentElementId: number | "loading";
  setCurrentElementId: (id: number | "loading") => void;
} | null>(null);

export const useFormBuilderContext = () => {
  const context = useContext(FormBuilderContext);

  if (!context)
    throw new Error(
      "Using FormBuilderContext, must be insde FormBuilder component",
    );

  return context;
};
