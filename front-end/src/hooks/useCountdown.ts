import { useCallback, useEffect, useState } from "react";

export const useCountdown = (from: number) => {
  const [count, setCount] = useState(from);

  const reset = useCallback(() => {
    setCount(from);
  }, [from]);

  useEffect(() => {
    if (count === 0) return;

    const intervalId = setInterval(() => {
      setCount((currentCount) => {
        if (currentCount === 1) {
          clearInterval(intervalId);
          return 0;
        }
        return currentCount - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [count]);

  return { count, reset };
};
