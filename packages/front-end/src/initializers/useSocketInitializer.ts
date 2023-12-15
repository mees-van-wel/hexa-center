import { socket } from "@/utils/socket";
import { useEffect } from "react";

export default function useSocketInitializer() {
  useEffect(() => {
    if (!socket.connected) socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
}
