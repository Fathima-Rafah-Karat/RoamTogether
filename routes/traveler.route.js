import {Router} from "express";
import { viewTrips,tripdetail,register,creatediary,viewdiary,viewall,createblog,viewallblog,reviewandrating ,viewratereview,viewnotify,mytrip,countparticipants} from "../controller/traveler.controller.js";
import upload from "../middlewares/multer.middleware.js";

const travelerRouter = Router();

travelerRouter.get("/trips",viewTrips);
travelerRouter.get("/:id",tripdetail);
travelerRouter.post("/register",  upload.fields([{ name: "photo", maxCount: 1 }, { name: "aadharcard", maxCount: 1 },]),register);
travelerRouter.get("/mytrip/view",mytrip);
travelerRouter.get("/participants/:id",countparticipants);
travelerRouter.post("/diary",creatediary);
travelerRouter.get("/diary/diaries",viewall);
travelerRouter.get("/diary/:id",viewdiary);
travelerRouter.post("/review&rating",reviewandrating);
travelerRouter.get("/review&rating/rateandreview",viewratereview)
travelerRouter.get("/notification/notify",viewnotify);
travelerRouter.post("/blog",createblog);
travelerRouter.get("/blog/view",viewallblog);

export default travelerRouter;
