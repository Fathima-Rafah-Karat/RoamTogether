import { Router } from "express";
import {organizerverification,createverify,count,monthlyGrowth,getVerificationStats} from "../controller/admin.controller.js"
const adminRouter =Router();

adminRouter.get("/count",count);
adminRouter.get("/viewverify",organizerverification);
adminRouter.put("/verify/:id",createverify);
adminRouter.get("/growth", monthlyGrowth);
adminRouter.get("/verification-stats", getVerificationStats);
export default adminRouter;
