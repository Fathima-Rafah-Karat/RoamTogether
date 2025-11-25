import { Router } from "express";
import {createTrip,updatetrip,deletetrip,viewtrip,viewtrips,createnotification,counttrip} from "../controller/organizer.controller.js";
import upload from "../middlewares/multer.middleware.js";

const organizerRouter =Router();

organizerRouter.get("/count",counttrip)
organizerRouter.post("/createtrip",  upload.array("tripPhoto", 5),createTrip);
organizerRouter.put("/:id",upload.array("tripPhoto", 5),updatetrip);
organizerRouter.delete("/:id",deletetrip);
organizerRouter.get("/view",viewtrips);
organizerRouter.get("/viewtrip/:id",viewtrip);
organizerRouter.post("/notification",createnotification)

export default organizerRouter;