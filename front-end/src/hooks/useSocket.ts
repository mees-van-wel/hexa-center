import { useEffect, useState } from "react";

import { socket } from "@/utils/socket";

const useSocket = <T = any>(event: string, exec?: (data: T) => any) => {
  const [data, setData] = useState<T>();

  useEffect(() => {
    socket.on(event, (newData: T) => {
      if (exec) exec(newData);
      if (newData || (data && !newData)) setData(newData);
    });

    return () => {
      socket.off(event);
    };
  }, [data, event, exec]);

  return data;
};

export default useSocket;
