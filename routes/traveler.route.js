import {Router} from "express";
import { viewTrips,tripdetail,register,creatediary,
    viewdiary,viewall,createblog,viewallblog,reviewandrating ,
    viewratereview,viewnotify,mytrip,countparticipants,
    countTraveler,deletediary,editdiary,contact,
     viewcontact,deletecontact,searchtrip,viewonenotify,
     marknotification} from "../controller/traveler.controller.js";
import upload from "../middlewares/multer.middleware.js";
import authorize  from "../middlewares/auth.middleware.js"
const travelerRouter = Router();
travelerRouter.post("/diary", authorize("Traveler"), creatediary);
travelerRouter.get("/diary/diaries", authorize("Traveler"), viewall);
travelerRouter.get("/diary/:id", authorize("Traveler"), viewdiary);
travelerRouter.put("/diary/:id", authorize("Traveler"), editdiary);
travelerRouter.delete("/diary/:id", authorize("Traveler"), deletediary);

travelerRouter.post("/emergency",authorize("Traveler") , contact);
travelerRouter.get("/viewemergency",authorize("Traveler") , viewcontact);
travelerRouter.delete("/emergency/:id", authorize("Traveler"), deletecontact);

travelerRouter.get("/notification/notify", authorize("Traveler"), viewnotify);
travelerRouter.get ("/notification/notify/:id",authorize("Traveler"),viewonenotify);
travelerRouter.put("/notification/mark/:id",authorize("Traveler"),marknotification);

travelerRouter.get("/search",searchtrip)
travelerRouter.get("/count",countTraveler)
travelerRouter.get("/trips",viewTrips);

travelerRouter.post("/register",  upload.fields([{ name: "photo", maxCount: 1 }, { name: "aadharcard", maxCount: 1 },]), authorize("Traveler"),register);

travelerRouter.get("/mytrip/view",authorize("Traveler"),mytrip);

travelerRouter.get("/participants/:id",countparticipants);
travelerRouter.post("/review&rating",reviewandrating);
travelerRouter.get("/review&rating/rateandreview",viewratereview)

travelerRouter.post("/blog",upload.single("photo"),createblog);
travelerRouter.get("/blog/view",viewallblog);

travelerRouter.get("/:id",tripdetail);


export default travelerRouter;