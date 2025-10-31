import {Router} from "express";

const travelerRouter = Router();

travelerRouter.get("/trips",(req,res)=>res.send({title:"trips details"}));
travelerRouter.get("/:id",(req,res)=>res.send({title:"one trip detail"}));
travelerRouter.post("/mytrip",(req,res)=>res.send({title:"my trip"}));
travelerRouter.get("/participants",(req,res)=>res.send({title:"view participants"}));
travelerRouter.delete("/canceltrip",(req,res)=>res.send({title:"cancel the trip"}));
travelerRouter.post("/register",(req,res)=>res.send({title:"register the trip"}));
travelerRouter.post("/diary",(req,res)=>res.send({title:" create travel diary"}));
travelerRouter.get("/diary",(req,res)=>res.send({title:"travel dairy"}));
travelerRouter.post("/review&rating",(req,res)=>res.send({title:"create review & rating"}));
travelerRouter.get("/notification",(req,res)=>res.send({title:"view notification"}));
travelerRouter.post("/blog",(req,res)=>res.send({title:"create the blog"}));
travelerRouter.get("/blog",(req,res)=>res.send({title:"view the blog"}));

export default travelerRouter;
