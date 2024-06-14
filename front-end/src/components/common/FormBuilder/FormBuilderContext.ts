import { createContext, useContext } from "react";

import { Form } from "./types";

export const FormBuilderContext = createContext<{
  form: Form;
  currentElementId: number;
  setCurrentElementId: (id: number) => void;
} | null>(null);

export const useFormBuilderContext = () => {
  const context = useContext(FormBuilderContext);

  if (!context)
    throw new Error(
      "Using FormBuilderContext, must be insde FormBuilder component",
    );

  return context;
};
