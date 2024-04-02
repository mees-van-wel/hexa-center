import { useCallback, useMemo } from "react";
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

export const useMemory = <
  T extends keyof RouterInput,
  P extends keyof RouterInput[T],
>(
  scope: T,
  procedure: P,
  params?: RouterInput[T][P],
) => {
  const [memoryStore, setMemoryStore] = useRecoilState(memoryState);

  const key = useMemo(
    () =>
      `${scope}-${procedure as string}${
        params ? "-" + JSON.stringify(params) : ""
      }`,
    [params, procedure, scope],
  );

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

  const update = useCallback(
    (dataToUpdate: AbstractEntity) => {
      const { cacheUpdates } = flatten(dataToUpdate, memoryStore);

      console.log("[MEMORY]", "🔵", "Manual update", key);

      cacheProcessor(cacheUpdates);
    },
    [key, memoryStore, cacheProcessor],
  );

  return { update };
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
      const refrence = `${data.$kind}:${data.id}`;

      const flattened: Partial<AbstractEntity> = {};

      for (const key in data) {
        flattened[key] = processData(data[key]);
      }

      if (refrence in cacheStore) {
        if (isEqual(cacheStore[refrence], flattened)) return refrence;
        cacheUpdates[refrence] = merge(cacheStore[refrence], flattened);
      } else cacheUpdates[refrence] = flattened;

      return refrence;
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
