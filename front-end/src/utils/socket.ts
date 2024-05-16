import { io } from "socket.io-client";

const socketServer = process.env.NEXT_PUBLIC_API_URL;
if (!socketServer) throw new Error("Missing NEXT_PUBLIC_API_URL in .env.local");

export const socket = io(socketServer, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});
