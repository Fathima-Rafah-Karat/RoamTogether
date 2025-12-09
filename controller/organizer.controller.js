import notification from "../model/notification.model.js";
import organizer from "../model/organizer.model.js";
import Emergency from "../model/emergency.model.js";

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
    const { travelerId, type, message } = req.body;

    if (!travelerId || !message) {
      return res.status(400).json({
        success: false,
        message: "travelerId and message are required",
      });
    }

    const notify = await notification.create({
      travelerId,
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

export const counttrip = async(req,res,next)=>{
   try{
   const counts=await organizer.countDocuments();
   res.status(200).json({
    success:true,
    data:counts
   })
  }
  catch(error){
    next(error);
  }
}



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
