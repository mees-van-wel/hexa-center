import { useCallback, useEffect, useState } from "react";

import { type RouterInput, type RouterOutput } from "@/utils/trpc";
import { getTrpcClientOnClient } from "@/utils/trpcForClient";

// TODO Error handling
// TODO Caching
export const useQuery = <
  T extends keyof RouterInput,
  P extends keyof RouterInput[T],
>(
  scope: T,
  procedure: P,
  options?: {
    initial?: boolean;
    initialParams?: RouterInput[T][P];
  },
) => {
  const [data, setData] = useState<RouterOutput[T][P]>();
  const [loading, setLoading] = useState(options?.initial);

  const query = useCallback(
    async (params?: RouterInput[T][P]) => {
      setLoading(true);

      const trpc = getTrpcClientOnClient();

      // @ts-ignore
      const result: RouterOutput[T][P] = await trpc[scope][procedure]
        .query(params)
        .finally(() => {
          setLoading(false);
        });

      setData(result);
      return result;
    },
    [scope, procedure],
  );

  useEffect(() => {
    if (!options?.initial) return;
    query(options?.initialParams);
  }, [options?.initial, options?.initialParams, query]);

  return { data, loading, query };
};
