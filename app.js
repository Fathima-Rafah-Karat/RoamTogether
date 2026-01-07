import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { PORT, NODE_ENV } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import travelerRouter from "./routes/traveler.route.js";
import organizerRouter from "./routes/organizer.route.js";
import adminRouter from "./routes/admin.route.js";
import verificationRouter from "./routes/verification.route.js";
import connectToDatabase from "./database/mongodb.js";
import errormiddleware from "./middlewares/error.middleware.js";
import Message from "./model/message.model.js";

const app = express();

// -------------------
// CORS Configuration
// -------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://roam-together.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// -------------------
// Middleware
// -------------------
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// -------------------
// Routes
// -------------------
app.use("/api/auth", authRouter);
app.use("/api/traveler", travelerRouter);
app.use("/api/organizer", organizerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/verify", verificationRouter);

// Error middleware
app.use(errormiddleware);

// -------------------
// Socket.io
// -------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "https://roam-together.netlify.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("joinRoom", (tripId) => {
    socket.join(tripId);
    console.log(`Joined room: ${tripId}`);
  });

  socket.on("sendMessage", async ({ tripId, text, senderId, senderName }) => {
    try {
      const message = await Message.create({ tripId, senderId, text, senderName });
      console.log("Message created:", message);

      io.to(tripId).emit("receiveMessage", message);
    } catch (err) {
      console.error("Message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("⚠️ Socket disconnected:", socket.id);
  });
});

// -------------------
// Start Server
// -------------------
const startServer = async () => {
  // Connect to MongoDB first
  await connectToDatabase();

  // Listen on Railway port or default 5000
  const port = PORT || 5000;
  server.listen(port, () => {
    console.log(`🚀 RoamTogether API running on port ${port} (${NODE_ENV})`);
  });
};

startServer();




