import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors, { type CorsOptions } from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { createAdapter } from "@socket.io/redis-adapter";
import { Emitter } from "@socket.io/redis-emitter";
import { createClient } from "redis";
import { setupEndpoints } from "./endpoints.js";

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const endpoints = await setupEndpoints();

const app = express();

app.use(helmet());
app.use(compression());

// Setting IP
app.use((req, _, next) => {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedIps =
    typeof forwarded === "string" ? forwarded.split(",") : forwarded;

  req.headers["x-forwarded-for"] =
    req.headers["fly-client-ip"] ||
    forwardedIps?.shift() ||
    req.socket.remoteAddress;

  next();
});
app.set("trust proxy", true);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(endpoints);

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
