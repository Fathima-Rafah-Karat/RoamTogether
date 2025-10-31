import express from "express";
import{PORT} from "./config/env.js"
import authRouter from "./routes/auth.route.js";
import travelerRouter from "./routes/traveler.route.js";

const app = express();
app.use("/api/auth",authRouter);
app.use("api/traveler",travelerRouter);

app.listen(PORT,()=>{
    console.log(`RoamTogether API is running on http://localhost:${PORT}`);
})