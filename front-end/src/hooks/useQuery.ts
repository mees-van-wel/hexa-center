import { useDidUpdate } from "@mantine/hooks";
import { useCallback, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { memoryState } from "@/states/memoryState";
import { consoleLog } from "@/utils/log";
import {
  getTrpcClient,
  type RouterInput,
  type RouterOutput,
} from "@/utils/trpc";

import { flatten, getCacheKey, unflatten } from "./useMemory";
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
    () => getCacheKey(scope, procedure, options?.initialParams),
    [options?.initialParams, procedure, scope],
  );

  const updateCacheHandler = useCallback(
    (updatedCache: Record<string, any>) => {
      setMemoryStore((current) => {
        const clone = { ...current };

        for (const cacheKey in updatedCache) {
          const value = updatedCache[cacheKey];

          if (value === undefined) delete clone[cacheKey];
          else clone[cacheKey] = value;
        }

        return clone;
      });
    },
    [setMemoryStore],
  );

  const query = useCallback(
    async (params?: RouterInput[T][P], abortController?: AbortController) => {
      setLoading(true);

      const trpc = getTrpcClient();

      // @ts-ignore Too complex typings
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

      consoleLog("[MEMORY]", "🔵", "Fetching from back-end, key:", key);

      return response;
    },
    [key, memoryStore, procedure, scope, updateCacheHandler],
  );

  const execute = useCallback(
    (abortController?: AbortController) => {
      if (key in memoryStore) {
        const unflattenedMemoryStore = unflatten(key, memoryStore);
        consoleLog("[MEMORY]", "🟢", "Memory hit, key:", key);

        setData(unflattenedMemoryStore);
        setLoading(false);
        return;
      }

      consoleLog("[MEMORY]", "🔴", "Memory miss, key:", key);

      query(options?.initialParams, abortController);
    },
    [key, memoryStore, options?.initialParams, query],
  );

  // TODO React errors to console
  const updateDeps = useMemo(
    () => [
      memoryStore[key],
      ...(Array.isArray(memoryStore[key])
        ? memoryStore[key]
        : [memoryStore[key]]
      ).map((ref: string) => memoryStore[ref]),
    ],
    [key, memoryStore],
  );

  useDidUpdate(() => {
    if (!data) return;

    // TODO Optimise, only unflatten current updateDeps instead of whole memoryStore
    const unflattenedMemoryStore = unflatten(key, memoryStore);
    // TODO Stop inital update and remove this workaround
    if (unflattenedMemoryStore) setData(unflattenedMemoryStore);
  }, updateDeps);

  // TODO Combine with strict mode effect
  useDidUpdate(() => {
    if (data || options?.skipInitial) return;

    const abortController = new AbortController();

    execute(abortController);

    return () => {
      abortController.abort();
    };
  }, [data, options?.initialParams, options?.skipInitial]);

  useStrictModeEffect(() => {
    if (data || options?.skipInitial) return;

    const abortController = new AbortController();

    execute(abortController);

    return () => {
      abortController.abort();
    };
  }, [data, options?.skipInitial]);

  return { data, loading, query };
};
