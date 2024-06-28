import { useState } from "react";

import {
  getTrpcClient,
  type RouterInput,
  type RouterOutput,
} from "@/utils/trpc";

// TODO Error handling
// TODO Caching
export const useMutation = <
  T extends keyof RouterInput,
  P extends keyof RouterInput[T],
>(
  scope: T,
  procedure: P,
) => {
  const [loading, setLoading] = useState(false);

  const mutate = async (
    params: RouterInput[T][P],
    options?: { signal?: AbortSignal },
  ) => {
    setLoading(true);

    const trpc = getTrpcClient();

    // @ts-ignore Too complex typings
    const result: RouterOutput[T][P] = await trpc[scope][procedure]
      .mutate(params, { signal: options?.signal })
      .finally(() => {
        setLoading(false);
      });

    return result;
  };

  return {
    loading,
    mutate,
  };
};
