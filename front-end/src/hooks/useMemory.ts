import { useCallback } from "react";
import merge from "deepmerge";
import isEqual from "fast-deep-equal";
import { useRecoilState } from "recoil";

import { memoryState } from "@/states/memoryState";
import { type RouterInput } from "@/utils/trpc";

export type AbstractEntity = {
  $kind: string;
  id: number;
  [key: string]: any;
};

type UpdateKeyFn<
  T extends keyof RouterInput,
  P extends keyof RouterInput[T],
> = {
  scope: T;
  procedure: P;
  params?: RouterInput[T][P];
  as?: ({ current, result }: { current: any; result: any }) => any;
};

export const useMemory = () => {
  const [memoryStore, setMemoryStore] = useRecoilState(memoryState);

  const cacheProcessor = useCallback(
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

  const write = useCallback(
    <T extends keyof RouterInput, P extends keyof RouterInput[T]>(
      dataToWrite: AbstractEntity,
      keysToUpdate: UpdateKeyFn<T, P>[] | UpdateKeyFn<T, P>,
    ) => {
      const { cacheUpdates, result } = flatten(dataToWrite, memoryStore);
      const clone = { ...cacheUpdates };

      (Array.isArray(keysToUpdate) ? keysToUpdate : [keysToUpdate]).forEach(
        ({ scope, procedure, params, as }) => {
          const key = getCacheKey(scope, procedure, params);
          const current = memoryStore[key];
          const value = as ? as({ current, result }) : result;

          if (value !== undefined) {
            clone[key] = value;
          }
        },
      );

      cacheProcessor(clone);

      console.log("[MEMORY]", "🔵", "Manual write, ref:", result);
    },
    [cacheProcessor, memoryStore],
  );

  const update = useCallback(
    (dataToUpdate: AbstractEntity) => {
      const { cacheUpdates, result } = flatten(dataToUpdate, memoryStore);
      cacheProcessor(cacheUpdates);

      console.log("[MEMORY]", "🔵", "Manual update, ref:", result);
    },
    [memoryStore, cacheProcessor],
  );

  const evict = useCallback(
    (dataToEvict: AbstractEntity) => {
      const ref = getCacheRef(dataToEvict);

      const cacheUpdates: Record<string, any> = { [ref]: undefined };

      Object.entries(memoryStore).forEach(([cacheKey, cachedValue]) => {
        if (typeof cachedValue === "string" && cachedValue === ref)
          cacheUpdates[cacheKey] = undefined;
        else if (Array.isArray(cachedValue) && cachedValue.includes(ref))
          cacheUpdates[cacheKey] = cachedValue.filter((item) => item !== ref);
      });

      cacheProcessor(cacheUpdates);

      console.log("[MEMORY]", "🔵", "Manual evict, ref:", ref);
    },
    [cacheProcessor, memoryStore],
  );

  return { write, update, evict };
};

export const flatten = (
  // key: string,
  rawData: any,
  cacheStore: Record<string, any> = {},
  // append?: boolean
) => {
  const cacheUpdates: Record<string, any> = {};

  const processData = (data: any): any => {
    if (Array.isArray(data)) return data.map((entry) => processData(entry));

    if (
      data !== null &&
      typeof data === "object" &&
      "$kind" in data &&
      "id" in data
    ) {
      const ref = getCacheRef(data);

      const flattened: Partial<AbstractEntity> = {};

      for (const key in data) {
        flattened[key] = processData(data[key]);
      }

      if (ref in cacheStore) {
        if (isEqual(cacheStore[ref], flattened)) return ref;
        cacheUpdates[ref] = merge(cacheStore[ref], flattened);
      } else cacheUpdates[ref] = flattened;

      return ref;
    }

    return data;
  };

  const result = processData(rawData);

  return { result, cacheUpdates };

  // cacheUpdates[key] =
  //   append &&
  //   Array.isArray(result) &&
  //   key in cacheStore &&
  //   Array.isArray(cacheStore[key])
  //     ? [...cacheStore[key], ...result]
  //     : result;
};

export const unflatten = (key: string, memoryStore: Record<string, any>) => {
  if (!(key in memoryStore)) return;

  const processCache = (data: any): any => {
    if (Array.isArray(data)) return data.map((entry) => processCache(entry));

    if (
      data !== null &&
      typeof data === "object" &&
      "$kind" in data &&
      "id" in data
    ) {
      const unFlattened: Partial<AbstractEntity> = {};

      for (const key in data) {
        unFlattened[key] = processCache(data[key]);
      }

      return unFlattened;
    }

    if (typeof data === "string" && data.includes(":") && data in memoryStore)
      return processCache(memoryStore[data]);

    return data;
  };

  return processCache(memoryStore[key]);
};

export const getCacheKey = <
  T extends keyof RouterInput,
  P extends keyof RouterInput[T],
>(
  scope: T,
  procedure: P,
  params?: RouterInput[T][P],
) => `${scope}-${procedure as string}(${params ? JSON.stringify(params) : ""})`;

export const getCacheRef = (entity: AbstractEntity) =>
  `${entity.$kind}:${entity.id}`;
