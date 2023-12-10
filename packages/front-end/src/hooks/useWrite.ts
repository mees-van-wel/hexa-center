import axios from "axios";
import { useState } from "react";

export const useWrite = (
  method: "POST" | "PATCH" | "DELETE",
  endpoint: string
) => {
  const [loading, setLoading] = useState(false);

  const execute = async (data?: any) => {
    setLoading(true);

    try {
      const result = await axios({
        method,
        url: process.env.NEXT_PUBLIC_API_URL + endpoint,
        data,
      });

      return result;
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};
