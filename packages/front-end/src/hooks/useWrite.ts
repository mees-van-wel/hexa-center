import axios, { type AxiosError } from "axios";
import { useRef, useState } from "react";

export const useWrite = (
  method: "POST" | "PATCH" | "DELETE",
  endpoint: string
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const abortController = useRef(new AbortController());

  const execute = async (data?: Record<string, any>) => {
    setLoading(true);

    const result = await axios({
      method,
      url: process.env.NEXT_PUBLIC_API_URL + endpoint,
      data,
      withCredentials: true,
      signal: abortController.current.signal,
    }).finally(() => {
      setLoading(false);
    });

    return result.data;
  };

  return { error, loading, execute, abortController: abortController.current };
};
