import notification from "../model/notification.model.js";
import organizer from "../model/organizer.model.js";
import Emergency from "../model/emergency.model.js";
import Traveler from "../model/traveler.model.js";
import reviewandrate from "../model/rateandreview.model.js";
export const createTrip = async (req,res,next)=>{
    try{
        const organizerId = req.user._id;
      const{title, description,location,startDate, endDate, participants,inclusions, price, inclusionspoint,exclusionspoint,planDetails}=req.body;
    //   more photo upload to tripphoto
         const tripPhoto = req.files ? req.files.map(file => file.path) : []; 
         
           let parsedPlanDetails = [];
    if (planDetails) {
      try {
        parsedPlanDetails = JSON.parse(planDetails);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in planDetails",
        });
      }
    }
         

        const trip=await organizer.create({ organizer: organizerId,title,description,location,startDate,endDate,participants,inclusions,tripPhoto,price,inclusionspoint,exclusionspoint,planDetails:parsedPlanDetails});
        res.status(200).json({
            success:true,
            data:trip
        })
    }
    catch(error){
        next(error);
    }
}

export const updatetrip =async(req,res,next)=>{
    try{
       const updatedata={...req.body};
        if (req.files ) {
      updatedata.tripPhoto = req.files.map(file => file.path);
    }
      if (updatedata.planDetails) {
      try {
        updatedata.planDetails = JSON.parse(updatedata.planDetails);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in planDetails",
        });
      }
    }
        const update = await organizer.findByIdAndUpdate(req.params.id, updatedata, { new: true });

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      data: update
    });
    }
    catch(error){
        next(error);
    }
}
export const deletetrip =async(req,res,next) =>{
    try{
        const deleted= await organizer.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success:true,
            data:deleted
        })
    }
    catch(error){
        next(error);
    }
}

export const viewtrip = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const trips = await organizer.find({ organizer: organizerId });

    return res.status(200).json({
      success: true,
      data: trips,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export  const  viewtrips = async(req,res,next)=>{
    try{
       const views=await organizer.find();
       if(!views){
        res.status(400).json({
            success:false,
            message:"user not found"
        })
       }
       res.status(200).json({
        success:true,
        data:views
       })
    }
    catch(error){
        next(error);
    }
}

export const createnotification = async (req, res, next) => {
  try {
    const { traveler, type, message } = req.body;

    if (!traveler || !message) {
      return res.status(400).json({
        success: false,
        message: "traveler and message are required",
      });
    }

    const notify = await notification.create({
      traveler,
      type,
      message,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: notify
    });

  } catch (error) {
    next(error);
  }
};





export const counttrip = async (req, res) => {
  try {
    // ✅ Get organizerId from token
    const organizerId = req.user.id;

    if (!organizerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = new Date();

    // ✅ Query Trip model (NOT organizer model)
    const trips = await organizer.find({ organizer: organizerId });

    let totalTrips = trips.length;
    let upcomingEvents = 0;
    let completedTrips = 0;
    let ongoingTrips = [];

    trips.forEach(trip => {
      if (trip.endDate < today) {
        completedTrips++;
      } else if (trip.startDate > today) {
        upcomingEvents++;
      } else {
        ongoingTrips.push(trip);
      }
    });

    const activeParticipants = ongoingTrips.reduce(
      (sum, trip) => sum + (trip.participants || 0),
      0
    );

    const completionRate =
      totalTrips === 0 ? 0 : Math.round((completedTrips / totalTrips) * 100);

    return res.status(200).json({
      totalTrips,
      activeParticipants,
      upcomingEvents,
      completionRate,
    });

  } catch (error) {
    console.error("Error fetching organizer stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const viewcontact = async (req, res, next) => {
  try {
    // Organizer must pass travelerId in the query
    const travelerId = req.query.travelerId;

    if (!travelerId) {
      return res.status(400).json({
        success: false,
        message: "Traveler ID is required",
      });
    }

    // Get all emergency contacts of this traveler
    const contacts = await Emergency.find({ traveler: travelerId });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    next(error);
  }
};

export const viewReview = async (req, res, next) => {
  try {
    const organizerId = req.user.id; // from auth middleware
    const tripId = req.params.id;    // trip id from URL

    // 1️⃣ Verify the trip belongs to this organizer
    const trip = await organizer.findOne({
      _id: tripId,
      organizer: organizerId, // usually the field in Trip schema is 'organizer'
    });

    if (!trip) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this trip's reviews",
      });
    }

    // 2️⃣ Fetch reviews for this trip
    const reviews = await reviewandrate.find({ trip: tripId })
      .populate("traveler", "name email") // populate traveler info
      .populate("trip", "title startDate endDate") // populate trip info
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    console.error("View Review Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};