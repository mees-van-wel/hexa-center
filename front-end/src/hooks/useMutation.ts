import { useState } from "react";

import { type RouterInput, type RouterOutput } from "@/utils/trpc";
import { getTrpcClientOnClient } from "@/utils/trpcForClient";

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

    const trpc = getTrpcClientOnClient();

    const lol = await trpc.user.list.query();

    // @ts-ignore
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
