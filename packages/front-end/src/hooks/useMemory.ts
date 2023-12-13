import { memoryState } from "@/states/memoryState";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

type Action = (...args: any[]) => Promise<any>;

type UseMemoryProps<T extends Action> = {
  name: string;
  action: T;
  params?: Parameters<T>;
  skip?: boolean;
  initialData?: Awaited<ReturnType<T>>;
};

type Return<T extends Action> = {
  fetch: (...params: Parameters<T>) => ReturnType<T>;
};

function useMemory<T extends Action>(
  props: UseMemoryProps<T> & { initialData: Awaited<ReturnType<T>> },
): [Awaited<ReturnType<T>>, Return<T>];
function useMemory<T extends Action>(
  props: UseMemoryProps<T>,
): [Awaited<ReturnType<T>> | undefined, Return<T>];

function useMemory<T extends Action>({
  name,
  action,
  params,
  initialData,
  skip = !!initialData,
}: UseMemoryProps<T>) {
  const [cacheMemory, setMemoryStore] = useRecoilState(memoryState);
  const [data, setData] = useState<Awaited<ReturnType<T>> | undefined>(
    initialData,
  );

  const fetch = async () => {
    const result = await action(params);
    return result;
  };

  useEffect(() => {
    if (skip) return;
    // Your useEffect logic
  }, []);

  return [data, { fetch }];
}

export default useMemory;
