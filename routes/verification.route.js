import { Router } from "express";
import { Verification,viewVerification } from "../controller/verification.controller.js";
import upload from "../middlewares/multer.middleware.js";

const verificationRouter =Router();

verificationRouter.post("/verification",  upload.fields([{ name: "photo", maxCount: 1 },{ name: "govtIdPhoto", maxCount: 1 },]),Verification);
verificationRouter.get("/view",upload.fields([{ name: "photo", maxCount: 1 },{ name: "govtIdPhoto", maxCount: 1 },]),viewVerification);

export default verificationRouter;