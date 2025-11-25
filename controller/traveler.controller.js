import Traveler from "../model/traveler.model.js";
import organizer from "../model/organizer.model.js";
import Diary from "../model/diary.model.js";
import blog from "../model/blog.model.js";
import reviewandrate from "../model/rateandreview.model.js";
import notification from "../model/notification.model.js";
import Emergency from "../model/emergency.model.js";

export const viewTrips = async (req, res, next) => {
    try {
        const trips=await organizer.find();
        res.status(200).json({
            success:true,
            data:trips
        })
    }
    catch (error) {
        next(error);
    }
}
export const tripdetail = async (req,res,next) =>{
    try{
      const trip= await organizer.findById(req.params.id);
      res.status(200).json({
        success:true,
        data:trip
      })
    }
    catch(error){
        next(error);
    }
}

export const register = async (req, res, next) => {
  try {
    const { name, phone, email, tripId } = req.body;

    const photo = req.files?.photo ? req.files.photo[0].path : null;
    const aadharcard = req.files?.aadharcard ? req.files.aadharcard[0].path : null;

    const traveler = await Traveler.create({
      name,
      phone,
      email,
      photo,
      aadharcard,
      tripsJoined: tripId ? [tripId] : [],
    });

    res.status(200).json({
      success: true,
      message: "Traveler registered successfully",
      data: traveler,
    });

  } catch (error) {
    console.error("Register traveler error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



export const creatediary =async(req,res,next)=>{
    try{
       const {title,date,yourstory}=req.body;
       const diary=await Diary.create({title,date,yourstory});
       res.status(200).json({
        success:true,
        data:diary
       })
    }
    catch(error){
        next(error);
    }
}

export const viewdiary=async(req,res,next)=>{
    try{
      const View=await Diary.findById(req.params.id);
      res.status(200).json({
        success:true,
        data:View
      })
    }
    catch(error){
        next(error);
    }
}

export const viewall = async (req, res) => {
  try {
    const diaries = await Diary.find();
    res.status(200).json({ success: true, count: diaries.length, diaries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deletediary=async (req,res,next)=>{
  try{
    const deleted=await Diary.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success:true,
      data:deleted
    })
  }
  catch(error){
    next (error);

  }
}

export const editdiary=async(req,res,next)=>{
  try {
        const edit= await Diary.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ success: true, data: edit })
    }
  catch(error){
    next(error);
  }
}
export const createblog =async (req,res,next)=>{
    try{
       const {title,content}=req.body;

    const photo = req.file ? req.file.path : null;
           const blogs=await blog.create({title,content,photo});
       res.status(200).json({
        success:true,
        data:blogs
       }) 
    }
    catch(error){
        next(error);
    }
}

export const viewallblog = async(req,res,next)=>{
    try{
      const blogs=await blog.find();
      res.status(200).json({
        success:true,
        data:blogs
      })
    }
    catch(error){
        next(error);
    }
}


export const reviewandrating = async (req, res, next) => {
  try {
    const { tripId, rating, review, TravelerId } = req.body;

    if (!tripId || !rating || !review || !TravelerId) {
      return res.status(400).json({
        success: false,
        message: "tripId, userId, rating, and review are required.",
      });
    }

    const create = await reviewandrate.create({
      tripId,
      TravelerId,
      rating,
      review,
    });

    res.status(200).json({
      success: true,
      message: "Review added successfully.",
      data: create,
    });
  } catch (error) {
    next(error);
  }
};

export const viewratereview = async (req, res, next) => {
  try {
    const rateandreview = await reviewandrate
      .find()
      .populate("TravelerId", "name photo");
    res.status(200).json({
      success: true,
      count: rateandreview.length,
      data: rateandreview,
    });
  } catch (error) {
    next(error);
  }
};

export const viewnotify=async(req,res,next)=>{
  try{
    const notify=await notification.find();
    res.status(200).json({
      success:true,
      data:notify
    })
  }
  catch(error){
    next(error);
  }
}

export const mytrip = async (req, res ,next) => {
  try {
    const { email } = req.query;

    const traveler = await Traveler.findOne({ email }).populate("tripsJoined");

    if (!traveler) {
      return res.status(404).json({ success: false, message: "Traveler not found" });
    }

    res.status(200).json({
      success: true,
      count: traveler.tripsJoined.length,
      data: traveler.tripsJoined,
    });
  } catch (error) {
   next(error);
  }
};

export const countparticipants = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    // Fetch all travelers who joined this trip
    const participants = await Traveler.find({ tripsJoined: tripId })
      .select("name "); // Select only safe fields

    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants,
    });

  } catch (error) {
    next(error);
  }
};


export const countTraveler= async (req,res,next)=>{
  try{
   const counts=await Traveler.countDocuments();
   res.status(200).json({
    success:true,
    data:counts
   })
  }
  catch(error){
    next(error);
  }
}

export const contact=async (req,res,next)=>{
  try{
  const{name,phone,relation}=req.body;
  const emergency=await Emergency.create({name,phone,relation})
  res.status(200).json({
    success:true,
    data:emergency
  })
  }
  catch(error){
    next(error);
  }
}

export const viewcontact=async (req,res,next)=>{
  try{
  const contact=await Emergency.find()
  res.status(200).json({
    success:true,
    data:contact
  })
  }
  catch(error){
    next(error);
  }
}

export const deletecontact = async (req, res, next) => {
  try {
    const deletes = await Emergency.findByIdAndDelete(req.params.id);

   
    res.status(200).json({
      success: true,
      data: deletes,
    });
  } catch (error) {
    next(error);
  }
};
export const searchtrip = async (req, res, next) => {
  try {
    const { location } = req.query;

    // If location is missing, return all trips
    if (!location) {
      const trips = await organizer.find();
      return res.status(200).json({
        success: true,
        data: trips,
        message: "No location provided, returning all trips",
      });
    }

    // Search trips where location contains the query (case-insensitive)
    const trips = await organizer.find({
      location: { $regex: location, $options: "i" },
    });

    if (trips.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No trips found for this location",
      });
    }

    res.status(200).json({
      success: true,
      data: trips,
    });

  } catch (error) {
    next(error);
  }
};