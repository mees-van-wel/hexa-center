import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { type CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";

import * as trpcExpress from "@trpc/server/adapters/express";

import { appRouter } from "./routes/_app";
import { ctx } from "./utils/context";
import { getDatabaseClient } from "./utils/database";
import { isProduction } from "./utils/environment";
import { createContext } from "./trpc";

// import { Server } from "socket.io";
// import { createAdapter } from "@socket.io/redis-adapter";
// import { Emitter } from "@socket.io/redis-emitter";
// import { createClient } from "redis";

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// TODO Make dynamic
const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:3000",
    "https://1-3-0.hexa.center",
    "https://local-residence.hexa.center",
    "https://longstay-breda.hexa.center",
  ],
  credentials: true,
};

const app = express();

app.use(helmet());
app.use(compression());
app.set("trust proxy", true);

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

// Initiating database connection
app.use(async (req, res, next) => {
  const origin = req.headers["origin"];
  if (isProduction && (!origin || typeof origin !== "string")) {
    console.warn("Missing origin header", JSON.stringify(req.headers));
    throw new Error("Missing origin header");
  }

  const subdomain = isProduction
    ? new URL(origin!).hostname.split(".")[0]
    : "hexa-center";

  try {
    const db = await getDatabaseClient(subdomain);
    ctx.run({ db, tenant: subdomain }, () => {
      req.db = db;
      req.tenant = subdomain;
      next();
    });
  } catch (error) {
    console.warn(error);

    return res
      .status(418)
      .send(
        "418 I'm a teapot - This subdomain does not have its own kettle to brew content.",
      );
  }
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

// const pubClient = createClient({ url: process.env.REDIS_URL });
// const subClient = pubClient.duplicate();
// const emitClient = pubClient.duplicate();

// await Promise.all([
//   pubClient.connect(),
//   subClient.connect(),
//   emitClient.connect(),
// ]);

const httpServer = createServer(app);

// TODO Save multiple socket id's to redis per user id
// const io = new Server(httpServer, {
//   transports: ["websocket"],
//   serveClient: false,
//   cors: corsOptions,
// });

// io.adapter(createAdapter(pubClient, subClient));
// const emitter = new Emitter(emitClient);

// io.on("connection", (socket) => {
//   console.log("Connected");

//   socket.on("disconnect", () => {
//     console.log("Disconnected");
//   });
// });

httpServer.listen(3001, async () => {
  console.log("back-end started");
});
