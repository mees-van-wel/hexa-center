import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { type CorsOptions } from "cors";
import { sql } from "drizzle-orm";
import express from "express";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import helmet from "helmet";
import { createServer } from "http";

import * as trpcExpress from "@trpc/server/adapters/express";

import { customers, integrationMappings, rooms } from "./db/schema";
import { appRouter } from "./routes/_app";
import { ctx } from "./utils/context";
import { getDatabaseClient } from "./utils/database";
import { isProduction } from "./utils/environment";
import { createContext } from "./trpc";

import "firebase/firestore";
// import { Server } from "socket.io";
// import { createAdapter } from "@socket.io/redis-adapter";
// import { Emitter } from "@socket.io/redis-emitter";
// import { createClient } from "redis";

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

const corsOptions: CorsOptions = {
  origin: ["http://localhost:3000", "https://1-3-0.hexa.center"],
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
  let subdomain = req.headers["x-subdomain"];
  if (!isProduction) subdomain = "hexa-center";

  if (!subdomain || typeof subdomain !== "string") {
    console.warn("Missing subdomain header", JSON.stringify(req.headers));
    throw new Error("Missing subdomain header");
  }

  try {
    const db = await getDatabaseClient(subdomain);
    ctx.run({ db }, () => {
      req.db = db;
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

  // await migrateFirebase();
});

const migrateFirebase = async (db: any) => {
  const app = initializeApp({
    apiKey: "AIzaSyAxEhAUNP-eZxPthXM0ascC0oWcfUpKa5Y",
    authDomain: "local-residence.firebaseapp.com",
    projectId: "local-residence",
    storageBucket: "local-residence.appspot.com",
    messagingSenderId: "965379884746",
    appId: "1:965379884746:web:70088016b71297fd09d633",
  });

  const firestore = getFirestore(app);

  const roomsMapping: Record<string, number> = {};
  const roomsQuery = query(collection(firestore, "rooms"));
  const roomsQuerySnapshot = await getDocs(roomsQuery);

  await Promise.all(
    roomsQuerySnapshot.docs.map(async (doc) => {
      const room = doc.data();

      const newRoomResult = await db
        .insert(rooms)
        .values({
          businessId: 1,
          name: room.name,
          price: room.price.toString(),
        })
        .returning();

      const newRoom = newRoomResult[0];

      roomsMapping[doc.id] = newRoom.id;
    }),
  );

  console.log({ roomsMapping });

  const customersMapping: Record<string, number> = {};
  const customersQuery = query(collection(firestore, "customers"));
  const customersQuerySnapshot = await getDocs(customersQuery);

  await Promise.all(
    customersQuerySnapshot.docs.map(async (doc) => {
      const customer = doc.data();
      if (!customer.twCode) return;

      const newCustomerResult = await db
        .insert(customers)
        .values({
          businessId: 1,
          name: customer.name,
          email:
            customer.email === "info@local-residence.com"
              ? null
              : customer.email || null,
          // phone: customer.phoneNumber || "REPLACE",
          billingAddressLineOne: `${customer.street} ${customer.houseNumber}`,
          billingCity: customer.city || "REPLACE",
          billingPostalCode: customer.postalCode || null,
          billingCountry: "NL",
          contactPersonName: customer.secondName || null,
        })
        .returning();

      const newCustomer = newCustomerResult[0];

      customersMapping[doc.id] = newCustomer.id;

      await db.insert(integrationMappings).values({
        connectionId: 1,
        refType: "customer",
        refId: newCustomer.id,
        data: sql`${{ code: customer.twCode }}::jsonb`,
      });
    }),
  );

  console.log({ customersMapping });

  const reservationsMapping: Record<string, number> = {};
  const reservationsQuery = query(collection(firestore, "bookings"));
  const reservationsQuerySnapshot = await getDocs(reservationsQuery);

  await Promise.all(
    reservationsQuerySnapshot.docs.map(async (doc) => {
      const reservation = doc.data();
    }),
  );

  console.log({ reservationsMapping });
};
