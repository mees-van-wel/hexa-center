import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useRef,
} from "react";

import { isProduction } from "@back-end/utils/environment";

export const useStrictModeEffect = (
  effect: EffectCallback,
  deps?: DependencyList,
) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (isProduction) {
      effect();
      return;
    }

    if (!hasRun.current) {
      hasRun.current = true;
      effect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
