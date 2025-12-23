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
import Message from "./model/message.model.js"; // ✅ IMPORTANT

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRouter);
app.use("/api/traveler", travelerRouter);
app.use("/api/organizer", organizerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/verify", verificationRouter);

app.use(errormiddleware);

/* =========================
   SERVER + SOCKET
========================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* =========================
   SOCKET LOGIC (FIXED)
========================= */
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("joinRoom", (tripId) => {
    socket.join(tripId);
    console.log(`👥 Joined room: ${tripId}`);
  });

  socket.on("sendMessage", async ({ tripId, text, sender }) => {
    try {
      if (!tripId || !text) return;

      // ✅ 1. SAVE MESSAGE TO DB
      const message = await Message.create({
        tripId,
        text,
        sender,
      });

      // ✅ 2. SEND TO ALL USERS IN ROOM
      io.to(tripId).emit("receiveMessage", message);
    } catch (error) {
      console.error("❌ Message error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

/* =========================
   START SERVER
========================= */
server.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🚀 RoamTogether API running on http://localhost:${PORT}`);
});
