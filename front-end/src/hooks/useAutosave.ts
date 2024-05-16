import { useDidUpdate } from "@mantine/hooks";
import { useRef } from "react";
import {
  type Control,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";

// TODO Fix dirty fields only
export const useAutosave = <T extends Control<any>>(
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
