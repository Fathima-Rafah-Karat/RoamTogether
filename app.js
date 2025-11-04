import express from "express";
import{PORT} from "./config/env.js"
import authRouter from "./routes/auth.route.js";
import travelerRouter from "./routes/traveler.route.js";
import organizerRouter from "./routes/organizer.route.js";
import adminRouter from "./routes/admin.route.js";
import connectToDatabase from "./database/mongodb.js";
import errormiddleware from "./middlewares/error.middleware.js";
import verificationRouter from "./routes/verification.route.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use("/api/auth",authRouter);
app.use("/api/traveler",travelerRouter);
app.use("/api/organizer",organizerRouter);
app.use("/api/admin",adminRouter);
app.use("/api/verify",verificationRouter)

app.use(errormiddleware);
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.listen(PORT,async()=>{
    console.log(`RoamTogether API is running on http://localhost:${PORT}`);
    await connectToDatabase();

})