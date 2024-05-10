import { useDidUpdate } from "@mantine/hooks";
import { useRef } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

// TODO Fix typings
// TODO Fix dirty fields only
export const useAutosave = <T>(
  control: T,
  // @ts-ignore Fix this
  callback: (values: T["_defaultValues"]) => any,
  delay = 700,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  // @ts-ignore Fix this
  const values = useWatch({ control });
  // @ts-ignore Fix this
  const { dirtyFields } = useFormState({ control });
  const { handleSubmit } = useFormContext();

  useDidUpdate(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const dirtyFieldKeys = Object.keys(dirtyFields);
      if (!dirtyFieldKeys.length) return;

      handleSubmit((values) => {
        callback(
          // @ts-ignore Fix this
          dirtyFieldKeys.reduce((acc, key) => {
            return { ...acc, [key]: values[key] };
          }, {}),
        );
      })();
    }, delay);
  }, [values]);
};
