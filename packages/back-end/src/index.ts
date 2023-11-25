import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
  console.log("YESS");

  const timer = setTimeout(() => {
    console.log("Emitting");
    socket.emit("hello");
  }, 10000);

  socket.on("disconnect", (reason) => {
    console.log("Goner", reason);
    clearTimeout(timer);
  });
});

httpServer.listen(3001, () => {
  console.log("back-end started");
});
