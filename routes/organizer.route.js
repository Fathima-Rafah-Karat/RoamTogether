import { Router } from "express";
import {createTrip,updatetrip,deletetrip,viewtrip,viewtrips,createnotification,counttrip,viewcontact} from "../controller/organizer.controller.js";
import upload from "../middlewares/multer.middleware.js";
import authorize from "../middlewares/auth.middleware.js";
const organizerRouter =Router();

organizerRouter.get("/count",authorize("Organizer"),counttrip);

organizerRouter.post("/createtrip",  authorize("Organizer"),upload.array("tripPhoto", 5),createTrip);
organizerRouter.put("/trip/:id",upload.array("tripPhoto", 5),updatetrip);
organizerRouter.delete("/deletetrip/:id",deletetrip);
organizerRouter.get("/view",viewtrips);
organizerRouter.get("/viewtrip",authorize("Organizer"),viewtrip);
organizerRouter.post("/notification",createnotification);
organizerRouter.get("/viewemergency",authorize("Organizer"),viewcontact);


export default organizerRouter;