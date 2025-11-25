import express from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import travelerRouter from "./routes/traveler.route.js";
import organizerRouter from "./routes/organizer.route.js";
import adminRouter from "./routes/admin.route.js";
import connectToDatabase from "./database/mongodb.js";
import errormiddleware from "./middlewares/error.middleware.js";
import verificationRouter from "./routes/verification.route.js";
import cors from "cors";

const app = express();

// FIXED CORS
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

app.use("/api/auth", authRouter);
app.use("/api/traveler", travelerRouter);
app.use("/api/organizer", organizerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/verify", verificationRouter);

app.use("/uploads", express.static("uploads"));

app.use(errormiddleware);
app.listen(PORT, async () => {
  console.log(`RoamTogether API is running on http://localhost:${PORT}`);
  await connectToDatabase();
});
