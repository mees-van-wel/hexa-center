import { useMemo, useState } from "react";
import { diff } from "deep-object-diff";
import { type BaseSchema, safeParse } from "valibot";

import { FieldValues, FormMethods } from "@/contexts/FormContext";

type UseFormProps<T> = {
  initialValues: T;
  validation?: BaseSchema<T, any>;
};

export const useForm = <T extends FieldValues>({
  initialValues,
  validation,
}: UseFormProps<T>): FormMethods<T> => {
  const [initialValuesState, setInitialValuesState] = useState(initialValues);
  const [values, setValues] = useState(initialValues);
  const [errors] = useState<Record<keyof T, string>>({} as T);

  const dirtyValues = useMemo(
    () => diff(initialValuesState, values),
    [initialValuesState, values],
  );

  return {
    values,
    errors,
    isDirty: !!Object.keys(dirtyValues).length,
    dirtyValues,
    setValues: (newValues) => setValues({ ...values, newValues }),
    // TODO Set errors
    validate: () => (validation ? safeParse(validation, values).success : true),
    register: (name) => ({
      name,
      error: errors[name],
      value: values[name],
      onChange: (value) => {
        setValues({
          ...values,
          [name]:
            value && typeof value === "object" && "target" in value
              ? value.target.value
              : value,
        });
      },
    }),
    reset: (newValues) => {
      if (!newValues) return setValues(initialValuesState);

      const merged = { ...values, ...newValues };
      setInitialValuesState(merged);
      setValues(merged);
    },
  };
};
