import { useState } from "react";

import { type RouterInput, type RouterOutput, trpc } from "@/utils/trpc";

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

  const mutate = async (params: RouterInput[T][P]) => {
    setLoading(true);

    // @ts-ignore
    const result: RouterOutput[T][P] = await trpc[scope][procedure]
      .mutate(params)
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
