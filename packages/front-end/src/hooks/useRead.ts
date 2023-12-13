import axios, { type AxiosError } from "axios";
import { useEffect, useState } from "react";

type UseReadProps = {
  params?: Record<string, any>;
  skip?: boolean;
};

export const useRead = (endpoint: string, options?: UseReadProps) => {
  const [data, setData] = useState();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState(!options?.skip);

  const execute = async (params?: Record<string, any>) => {
    setLoading(true);

    const queryParams = new URLSearchParams(params).toString();

    try {
      const { data } = await axios.get(
        process.env.NEXT_PUBLIC_API_URL +
          endpoint +
          (queryParams ? "?" + queryParams : ""),
      );

      setData(data);
      return data;
    } catch (axiosError) {
      setError(axiosError as AxiosError);
      return axiosError;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options?.skip) return;
    execute(options?.params);
  }, [options?.skip, options?.params]);

  return [data, { loading, error, execute }] as const;
};
