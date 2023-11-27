import { socket } from "@/socket";
import { useEffect } from "react";

export default function useInitializeSocket() {
  useEffect(() => {
    if (!socket.connected) socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
}
