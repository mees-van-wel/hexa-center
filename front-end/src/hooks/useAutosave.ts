import { useRef } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

import { useDidUpdate } from "@mantine/hooks";

// TODO Fix typings
export const useAutosave = <T>(
  control: T,
  callback: (values: T["_defaultValues"]) => any,
  delay = 700,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const values = useWatch({ control });
  const { dirtyFields } = useFormState({ control });
  const { handleSubmit } = useFormContext();

  useDidUpdate(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const dirtyFieldKeys = Object.keys(dirtyFields);
      if (!dirtyFieldKeys.length) return;

      handleSubmit((values) => {
        callback(
          dirtyFieldKeys.reduce((acc, key) => {
            return { ...acc, [key]: values[key] };
          }, {}),
        );
      })();
    }, delay);
  }, [values]);
};
