import { useCallback, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { memoryState } from "@/states/memoryState";
import { type RouterInput, type RouterOutput } from "@/utils/trpc";
import { getTrpcClientOnClient } from "@/utils/trpcForClient";

import { flatten, unflatten } from "./useMemory";
import { useStrictModeEffect } from "./useStrictModeEffect";

// TODO Error handling
export const useQuery = <
  T extends keyof RouterInput,
  P extends keyof RouterInput[T],
>(
  scope: T,
  procedure: P,
  options?: {
    skipInitial?: boolean;
    initialParams?: RouterInput[T][P];
  },
) => {
  const [memoryStore, setMemoryStore] = useRecoilState(memoryState);
  const [data, setData] = useState<RouterOutput[T][P]>();
  const [loading, setLoading] = useState(!options?.skipInitial);

  const key = useMemo(
    () =>
      `${scope}-${procedure as string}${
        options?.initialParams
          ? "-" + JSON.stringify(options.initialParams)
          : ""
      }`,
    [options?.initialParams, procedure, scope],
  );

  const updateCacheHandler = useCallback(
    (updatedCache: Record<string, any>) => {
      const clone = { ...memoryStore };

      for (const cacheKey in updatedCache) {
        const value = updatedCache[cacheKey];

        if (value === undefined) delete clone[cacheKey];
        else clone[cacheKey] = value;
      }

      setMemoryStore(clone);
    },
    [memoryStore, setMemoryStore],
  );

  const query = useCallback(
    async (params?: RouterInput[T][P], abortController?: AbortController) => {
      console.log("[MEMORY]", "🔵", "Manual fetch", key);

      setLoading(true);

      const trpc = getTrpcClientOnClient();

      // @ts-ignore
      const response: RouterOutput[T][P] = await trpc[scope][procedure]
        .query(
          params,
          abortController ? { signal: abortController.signal } : undefined,
        )
        .finally(() => {
          setLoading(false);
        });

      const { cacheUpdates, result } = flatten(response, memoryStore);

      updateCacheHandler({ ...cacheUpdates, [key]: result });
      setData(response);

      console.log("[MEMORY]", "🟢", "Initial fetch success", key);

      return response;
    },
    [key, memoryStore, procedure, scope, updateCacheHandler],
  );

  useStrictModeEffect(() => {
    if (data || options?.skipInitial) return;

    if (key in memoryStore) {
      const unflattenedMemoryStore = unflatten(key, memoryStore);
      console.log("[MEMORY]", "🟢", "Memory read success", key);

      console.log(memoryStore);

      setData(unflattenedMemoryStore);
      setLoading(false);
      return;
    }

    console.log("[MEMORY]", "🔴", "Memory read not found", key);

    const abortController = new AbortController();

    query(options?.initialParams, abortController);

    return () => {
      abortController.abort();
    };
  }, [
    data,
    key,
    memoryStore,
    options?.initialParams,
    options?.skipInitial,
    query,
  ]);

  return { data, loading, query };
};
