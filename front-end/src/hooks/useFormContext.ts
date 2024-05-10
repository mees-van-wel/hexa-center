import { useContext } from "react";

import { FormContext, FormMethods } from "@/contexts/FormContext";

type FieldValues = Record<string, any>;

export const useFormContext = <T extends FieldValues>(): FormMethods<T> => {
  const formContext = useContext(FormContext);

  if (!formContext)
    throw new Error("useFormContext must be used within FormContextProvider");

  // @ts-ignore Fix this
  return formContext;
};
