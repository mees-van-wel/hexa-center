import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors, { type CorsOptions } from "cors";
import { createAdapter } from "@socket.io/redis-adapter";
import { Emitter } from "@socket.io/redis-emitter";
import { createClient } from "redis";
import client from "./db/client.js";
import { users } from "./db/schema.js";

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
const emitClient = pubClient.duplicate();

await Promise.all([
  pubClient.connect(),
  subClient.connect(),
  emitClient.connect(),
]);

const httpServer = createServer(app);

// TODO Save multiple socket id's to redis per user id
const io = new Server(httpServer, {
  transports: ["websocket"],
  serveClient: false,
  cors: corsOptions,
});

io.adapter(createAdapter(pubClient, subClient));
const emitter = new Emitter(emitClient);

io.on("connection", (socket) => {
  console.log("Connected");

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

httpServer.listen(3001, () => {
  console.log("back-end started");
});

app.get("/", async (_, res) => {
  console.log("retriving");
  const data = await client
    .selectDistinct()
    .from(users)
    .prepare("users")
    .execute();

  res.json(data);
});
