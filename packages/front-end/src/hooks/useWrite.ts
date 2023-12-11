import axios, { type AxiosError } from "axios";
import { useState } from "react";

export const useWrite = (
  method: "POST" | "PATCH" | "DELETE",
  endpoint: string
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();

  const execute = async (data?: Record<string, any>) => {
    setLoading(true);

    try {
      const result = await axios({
        method,
        url: process.env.NEXT_PUBLIC_API_URL + endpoint,
        data,
      });

      return result.data;
    } catch (axiosError) {
      setError(axiosError as AxiosError);
      return axiosError;
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, execute };
};
