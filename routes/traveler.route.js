import {Router} from "express";
import { viewTrips,tripdetail,register,creatediary,
    viewdiary,viewall,createblog,viewallblog,reviewandrating ,
    viewratereview,viewnotify,mytrip,countparticipants,
    countTraveler,deletediary,editdiary,contact,
     viewcontact,deletecontact,searchtrip,viewonenotify,
     marknotification,deleteRegisteredTrip,viewregistered} from "../controller/traveler.controller.js";
import upload from "../middlewares/multer.middleware.js";
import authorize  from "../middlewares/auth.middleware.js"
import {
  saveMessage,
  getMessagesByTrip,
} from "../controller/message.controller.js";

const travelerRouter = Router();

travelerRouter.get("/notification/notify", authorize("Traveler"), viewnotify);
travelerRouter.get ("/notification/notify/:id",authorize("Traveler"),viewonenotify);
travelerRouter.put("/notification/mark/:id",authorize("Traveler"),marknotification);

travelerRouter.delete("/remove-trip/:tripId", authorize("Traveler"), deleteRegisteredTrip);

travelerRouter.get("/mytrip/view",authorize("Traveler"),mytrip);
travelerRouter.post("/diary", authorize("Traveler"), creatediary);
travelerRouter.get("/diary/diaries", authorize("Traveler"), viewall);
travelerRouter.get("/diary/:id", authorize("Traveler"), viewdiary);
travelerRouter.put("/diary/:id", authorize("Traveler"), editdiary);
travelerRouter.delete("/diary/:id", authorize("Traveler"), deletediary);

travelerRouter.post("/emergency",authorize("Traveler") , contact);
travelerRouter.get("/viewemergency",authorize("Traveler") , viewcontact);
travelerRouter.delete("/emergency/:id", authorize("Traveler"), deletecontact);

// CHAT ROUTES
travelerRouter.post(
  "/:tripId/message",
  // authorize("Traveler"),
  saveMessage
);

travelerRouter.get(
  "/:tripId/messages",
  // authorize("Traveler"),
  getMessagesByTrip
);


travelerRouter.get("/search",searchtrip)
travelerRouter.get("/count",countTraveler)
travelerRouter.get("/trips",viewTrips);

travelerRouter.post("/review&rating",authorize("Traveler"),reviewandrating);

travelerRouter.post("/register",  upload.fields([{ name: "photo", maxCount: 1 }, { name: "aadharcard", maxCount: 1 },]), authorize("Traveler"),register);
travelerRouter.get ("/registered",authorize("Traveler"),viewregistered)

travelerRouter.get("/participants/:id",countparticipants);
travelerRouter.get("/review&rating/rateandreview",viewratereview)

travelerRouter.post("/blog",upload.single("photo"),createblog);
travelerRouter.get("/blog/view",viewallblog);

travelerRouter.get("/:id",tripdetail);


export default travelerRouter;