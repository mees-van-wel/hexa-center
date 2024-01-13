import { useRef } from "react";
import { useWatch } from "react-hook-form";

import { useDidUpdate } from "@mantine/hooks";

// TODO * Only dirtyfields
// TODO Fix typings
export const useDebounce = <T>(
  control: T,
  callback: (values: T["_defaultValues"]) => any,
  delay = 700,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const values = useWatch({ control });

  useDidUpdate(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // TODO *
    timeoutRef.current = setTimeout(() => callback(values), delay);
  }, [values]);
};
