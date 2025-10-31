import { Router } from "express";

const adminRouter =Router();

adminRouter.get("/count",(req,res)=>res.send({title:"count"}));
adminRouter.get("/verify",(req,res)=>res.send({title:"organizer verification"}));
adminRouter.put("/verify",(req,res)=>res.send({title:"create verify"}));


export default adminRouter;
