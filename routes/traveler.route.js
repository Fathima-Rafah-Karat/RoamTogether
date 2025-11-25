import {Router} from "express";
import { viewTrips,tripdetail,register,creatediary,
    viewdiary,viewall,createblog,viewallblog,reviewandrating ,
    viewratereview,viewnotify,mytrip,countparticipants,
    countTraveler,deletediary,editdiary,contact,
     viewcontact,deletecontact,searchtrip} from "../controller/traveler.controller.js";
import upload from "../middlewares/multer.middleware.js";

const travelerRouter = Router();

travelerRouter.get("/viewemergency",viewcontact);
travelerRouter.get("/search",searchtrip)
travelerRouter.get("/count",countTraveler)
travelerRouter.get("/trips",viewTrips);
travelerRouter.get("/:id",tripdetail);
travelerRouter.post("/register",  upload.fields([{ name: "photo", maxCount: 1 }, { name: "aadharcard", maxCount: 1 },]),register);
travelerRouter.get("/mytrip/view",mytrip);
travelerRouter.get("/participants/:id",countparticipants);
travelerRouter.post("/diary",creatediary);
travelerRouter.get("/diary/diaries",viewall);
travelerRouter.get("/diary/:id",viewdiary);
travelerRouter.delete("/diary/:id",deletediary)
travelerRouter.put("/diary/:id",editdiary)
travelerRouter.post("/review&rating",reviewandrating);
travelerRouter.get("/review&rating/rateandreview",viewratereview)
travelerRouter.get("/notification/notify",viewnotify);
travelerRouter.post("/blog",upload.single("photo"),createblog);
travelerRouter.get("/blog/view",viewallblog);
travelerRouter.post("/emergency",contact);
travelerRouter.delete("/emergency/:id",deletecontact);


export default travelerRouter;
