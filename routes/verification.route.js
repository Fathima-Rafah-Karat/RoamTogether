import { Router } from "express";
import { Verification,viewVerification,status } from "../controller/verification.controller.js";
import upload from "../middlewares/multer.middleware.js";
import authorize from "../middlewares/auth.middleware.js";

const verificationRouter =Router();

verificationRouter.post("/verification",  upload.fields([{ name: "photo", maxCount: 1 },{ name: "govtIdPhoto", maxCount: 1 },]),authorize("Organizer"),Verification);
verificationRouter.get("/view",upload.fields([{ name: "photo", maxCount: 1 },{ name: "govtIdPhoto", maxCount: 1 },]),viewVerification);
verificationRouter.get("/viewverify/:id",authorize("Organizer"),status);
export default verificationRouter;