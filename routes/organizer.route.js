import { Router } from "express";

const organizerRouter =Router();

organizerRouter.post("/verification",(req,res)=>res.send({title:"organizer verification"}));
organizerRouter.post("/createtrip",(req,res)=>res.send({title:"create a trip"}));
organizerRouter.get("/createdtrip",(req,res)=>res.send({title:"view created trip"}));
organizerRouter.get("/participants",(req,res)=>res.send({title:"view participants"}));

export default organizerRouter;