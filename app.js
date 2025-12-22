import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import travelerRouter from "./routes/traveler.route.js";
import organizerRouter from "./routes/organizer.route.js";
import adminRouter from "./routes/admin.route.js";
import verificationRouter from "./routes/verification.route.js";
import connectToDatabase from "./database/mongodb.js";
import errormiddleware from "./middlewares/error.middleware.js";

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/traveler", travelerRouter);
app.use("/api/organizer", organizerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/verify", verificationRouter);

app.use("/uploads", express.static("uploads"));
app.use(errormiddleware);

//  CREATE HTTP SERVER
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔌 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log(" Socket connected:", socket.id);

  socket.on("joinRoom", (tripId) => {
    socket.join(tripId);
    console.log(` User joined trip room: ${tripId}`);
  });

  socket.on("sendMessage", ({ tripId, text, sender }) => {
    console.log(" Message received:", text);

    io.to(tripId).emit("receiveMessage", {
      text,
      sender,
      time: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log(" Socket disconnected:", socket.id);
  });
});



//  START SERVER
server.listen(PORT, async () => {
  console.log(`RoamTogether API + Socket running on http://localhost:${PORT}`);
  await connectToDatabase();
});
