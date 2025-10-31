import express from "express";
import{PORT} from "./config/env.js"
import authRouter from "./routes/auth.route.js";
import travelerRouter from "./routes/traveler.route.js";
import organizerRouter from "./routes/organizer.route.js";
import adminRouter from "./routes/admin.route.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();
app.use("/api/auth",authRouter);
app.use("/api/traveler",travelerRouter);
app.use("/api/organizer",organizerRouter);
app.use("/api/admin",adminRouter);

app.listen(PORT,async()=>{
    console.log(`RoamTogether API is running on http://localhost:${PORT}`);
    await connectToDatabase();

})