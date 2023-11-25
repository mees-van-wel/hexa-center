import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(
  cors((req, callback) => {
    callback(null, { credentials: true });
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  serveClient: false,
  cors: (origin, callback) => {
    callback(null, { credentials: true });
  },
});

io.on("connection", (socket) => {
  console.log("YESS");

  socket.on("disconnect", (reason) => {
    console.log("Goner", reason);
  });
});

httpServer.listen(3001);
