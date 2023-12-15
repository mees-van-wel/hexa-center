import { trpc, type RouterInput, type RouterOutput } from "@/utils/trpc";
import { useCallback, useEffect, useState } from "react";

// TODO Error handling
// TODO Caching
export const useQuery = <
  T extends keyof RouterInput,
  P extends keyof RouterInput[T],
>(
  scope: T,
  procedure: P,
  initialParams?: RouterInput[T][P],
  options?: {
    skip?: boolean;
  },
) => {
  const [data, setData] = useState<RouterOutput[T][P]>();
  const [loading, setLoading] = useState(!options?.skip);

  const query = useCallback(
    async (params?: RouterInput[T][P]) => {
      setLoading(true);

      // @ts-ignore
      const result: RouterOutput[T][P] = await trpc[scope][procedure]
        .query(initialParams || params)
        .finally(() => {
          setLoading(false);
        });

      setData(result);
      return result;
    },
    [initialParams, procedure, scope],
  );

  useEffect(() => {
    if (options?.skip) return;
    query(initialParams);
  }, [initialParams, options?.skip, query]);

  return { data, loading, query };
};
