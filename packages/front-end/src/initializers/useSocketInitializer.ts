import { useEffect } from "react";

import { socket } from "@/utils/socket";

export default function useSocketInitializer() {
  useEffect(() => {
    if (!socket.connected) socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
}
