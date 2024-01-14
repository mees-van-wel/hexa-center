import { useRef } from "react";
import { useFormState, useWatch } from "react-hook-form";

import { useDidUpdate } from "@mantine/hooks";

// TODO Fix typings
export const useDebounce = <T>(
  control: T,
  callback: (values: T["_defaultValues"]) => any,
  delay = 700,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const values = useWatch({ control });
  const { dirtyFields } = useFormState({ control });

  useDidUpdate(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () =>
        callback(
          Object.keys(dirtyFields).reduce((acc, key) => {
            return { ...acc, [key]: values[key] };
          }, {}),
        ),
      delay,
    );
  }, [values]);
};
