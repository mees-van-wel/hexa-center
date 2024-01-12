import { createContext } from "react";

export type FieldValues = Record<string, any>;

export type FormMethods<T extends FieldValues> = {
  values: T;
  errors: Record<keyof T, string>;
  isDirty: boolean;
  dirtyValues: Partial<T>;
  setValues: (values: Partial<T>) => void;
  reset: (newValues?: Partial<T> | undefined) => void;
  validate: () => boolean;
  register: <K extends keyof T>(
    name: K,
  ) => {
    name: K;
    error: Record<keyof T, string>[K];
    value: T[K];
    onChange: (
      value: T[K] | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
  };
};

export type FormContext<T extends FieldValues> = FormMethods<T> | null;

export const FormContext = createContext<FormContext<FieldValues>>(null);

export const FormProvider = <T extends FieldValues>({
  children,
  ...formMethods
}: {
  children: React.ReactNode;
} & FormMethods<T>) => (
  <FormContext.Provider value={formMethods}>{children}</FormContext.Provider>
);
