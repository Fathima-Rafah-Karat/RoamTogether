import { Router } from "express";
import {organizerverification,createverify} from "../controller/admin.controller.js"
const adminRouter =Router();

adminRouter.get("/count",(req,res)=>res.send({title:"count"}));
adminRouter.get("/verify",organizerverification);
adminRouter.put("/verify/:id",createverify);


export default adminRouter;
