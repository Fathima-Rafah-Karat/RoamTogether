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



// Create diary
export const creatediary = async (req, res, next) => {
  try {
    const { title, date, yourstory } = req.body;
    const diary = await Diary.create({
      title,
      date,
      yourstory,
      traveler: req.user._id
 // associate diary with logged-in traveler
    });
    res.status(200).json({ success: true, data: diary });
  } catch (error) {
    next(error);
  }
};

// View single diary (only if belongs to logged-in traveler)
export const viewdiary = async (req, res, next) => {
  try {
    const diary = await Diary.findOne({ _id: req.params.id, traveler: req.traveler._id });
    if (!diary) {
      return res.status(404).json({ success: false, message: "Diary not found" });
    }
    res.status(200).json({ success: true, data: diary });
  } catch (error) {
    next(error);
  }
};

// View all diaries of logged-in traveler
export const viewall = async (req, res, next) => {
  try {
    const diaries = await Diary.find({ traveler: req.user._id });
    res.status(200).json({ success: true, count: diaries.length, diaries });
  } catch (error) {
    next(error);
  }
};

// Delete diary (only if belongs to traveler)
export const deletediary = async (req, res, next) => {
  try {
    const diary = await Diary.findOneAndDelete({ _id: req.params.id, traveler: req.traveler._id });
    if (!diary) {
      return res.status(404).json({ success: false, message: "Diary not found or unauthorized" });
    }
    res.status(200).json({ success: true, data: diary });
  } catch (error) {
    next(error);
  }
};

// Edit diary (only if belongs to traveler)
export const editdiary = async (req, res, next) => {
  try {
    const diary = await Diary.findOneAndUpdate(
      { _id: req.params.id, traveler: req.traveler._id },
      req.body,
      { new: true }
    );
    if (!diary) {
      return res.status(404).json({ success: false, message: "Diary not found or unauthorized" });
    }
    res.status(200).json({ success: true, data: diary });
  } catch (error) {
    next(error);
  }
};

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

export const viewnotify = async (req, res, next) => {
  try {
    const travelerId = req.user._id;

    const notify = await notification.find({ travelerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notify.length,
      data: notify
    });

  } catch (error) {
    next(error);
  }
};

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

export const contact = async (req, res, next) => {
  try {
    const travelerId = req.user._id;  // logged-in traveler

    const { name, phone, relation } = req.body;

    const emergency = await Emergency.create({
      name,
      phone,
      relation,
      traveler: travelerId
    });

    res.status(200).json({
      success: true,
      data: emergency
    });

  } catch (error) {
    next(error);
  }
};


export const viewcontact = async (req, res, next) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const travelerId = req.user._id;

    const contacts = await Emergency.find({ traveler: travelerId });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};



export const deletecontact = async (req, res, next) => {
  try {
    const travelerId = req.user._id;

    const deleted = await Emergency.findOneAndDelete({
      _id: req.params.id,
      traveler: travelerId
    });

    if (!deleted) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to delete this contact"
      });
    }

    res.status(200).json({
      success: true,
      data: deleted
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
