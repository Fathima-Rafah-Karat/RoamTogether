import { Router } from "express";
import {createTrip,updatetrip,deletetrip,viewtrip,viewtrips} from "../controller/organizer.controller.js";
import upload from "../middlewares/multer.middleware.js";

const organizerRouter =Router();

organizerRouter.post("/createtrip",  upload.array("tripPhoto", 5),createTrip);
organizerRouter.put("/:id",upload.array("tripPhoto", 5),updatetrip);
organizerRouter.delete("/:id",deletetrip);
organizerRouter.get("/view",viewtrips);
organizerRouter.get("/viewtrip/:id",viewtrip);
organizerRouter.get("/participants",(req,res)=>res.send({title:"view participants"}));

export default organizerRouter;