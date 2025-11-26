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

export const register = async (req, res) => {
  try {
    // 1️⃣ Check if user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized. Please login." });
    }

    const { name, phone, email, tripId } = req.body;

    // 2️⃣ Check if trip exists
    const trip = await organizer.findById(tripId);
    if (!trip) {
      return res
        .status(404)
        .json({ success: false, error: "Trip not found" });
    }

    // 3️⃣ Check participant limit
    const currentCount = await Traveler.countDocuments({
      tripsJoined: tripId,
    });
    if (currentCount >= trip.participants) {
      return res
        .status(400)
        .json({ success: false, error: "Registration full" });
    }

    // 4️⃣ Handle file uploads (Multer required)
    const photo = req.files?.photo?.[0]?.path || null;
    const aadharcard = req.files?.aadharcard?.[0]?.path || null;

    // 5️⃣ Create traveler
    const traveler = await Traveler.create({
      authId: req.user._id,
      name,
      phone,
      email,
      photo,
      aadharcard,
      tripsJoined: [tripId],
    });

    return res.status(201).json({ success: true, traveler });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
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

// View one notification
export const viewonenotify = async (req, res, next) => {
  try {
    const travelerId = req.user._id; // logged-in user
    const notifyId = req.params.id;  // notification id from URL

    // Find notification
    const notify = await notification.findById(notifyId);

    // If not found
    if (!notify) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if notification belongs to logged-in traveler
    if (notify.travelerId.toString() !== travelerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this notification",
      });
    }

    res.status(200).json({
      success: true,
      data: notify,
    });

  } catch (error) {
    next(error);
  }
};
  

// Mark a notification as read
export const marknotification = async (req, res, next) => {
  try {
    const travelerId = req.user._id; // logged-in user
    const notifyId = req.params.id;  // notification ID from URL

    // Find notification
    const notify = await notification.findById(notifyId);

    if (!notify) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Ensure the notification belongs to the logged-in user
    if (notify.travelerId.toString() !== travelerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to mark this notification",
      });
    }

    // Update isRead to true if not already
    if (!notify.isRead) {
      notify.isRead = true;
      await notify.save();
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notify,
    });

  } catch (error) {
    next(error);
  }
};


export const mytrip = async (req, res) => {
  try {
    // Find the traveler for the logged-in user
    const traveler = await Traveler.findOne({ authId: req.user._id }).populate({
      path: "tripsJoined",
      select: "title location startDate endDate image participants", // select only needed fields
    });

    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: "Traveler not found",
      });
    }

    // Current date
    const now = new Date();

    // Only trips the user joined
    const upcoming = traveler.tripsJoined.filter((trip) => new Date(trip.startDate) >= now);
    const past = traveler.tripsJoined.filter((trip) => new Date(trip.endDate) < now);

    res.status(200).json({
      success: true,
      upcoming,
      past,
    });
  } catch (error) {
    console.log("MYTRIP ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export const countparticipants = async (req, res) => {
  try {
    const { id } = req.params;

    const participants = await Traveler.find({ tripsJoined: id })
      .select("name email photo");

    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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


