import Traveler from "../model/traveler.model.js";
import organizer from "../model/organizer.model.js";
import Diary from "../model/diary.model.js";
import blog from "../model/blog.model.js";
import reviewandrate from "../model/rateandreview.model.js";
import notification from "../model/notification.model.js";
import Emergency from "../model/emergency.model.js";
import Auth from "../model/auth.model.js";


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
      const trip= await organizer.findById(req.params.id).lean();
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
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized. Please login." });
    }

    const { name, phone, email, tripId } = req.body;

    const trip = await organizer.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, error: "Trip not found" });

    const now = new Date();
    if (new Date(trip.startDate) < now) {
      return res.status(400).json({
        success: false,
        error: "Cannot register. Trip already started.",
      });
    }

    
    let traveler = await Traveler.findOne({ authId: req.user._id });

    
    if (!traveler) {
      const photo = req.files?.photo?.[0]?.path || null;
      const aadharcard = req.files?.aadharcard?.[0]?.path || null;

      traveler = await Traveler.create({
        authId: req.user._id,
        name,
        phone,
        email,
        photo,
        aadharcard,
        tripsJoined: [tripId],
      });
    } else {
      
      if (!traveler.tripsJoined.includes(tripId)) {
        traveler.tripsJoined.push(tripId);
        await traveler.save();
      }
    }

    return res.status(201).json({ success: true, traveler });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
export const viewregistered = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized. Please login.",
      });
    }

    // Find traveler document by linked auth user
    const traveler = await Traveler.findOne({ authId: req.user._id });

    // If traveler profile does not exist yet → return empty
    if (!traveler) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Traveler profile not created yet.",
      });
    }

    // If user hasn't joined any trips
    if (!traveler.tripsJoined || traveler.tripsJoined.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No registered trips.",
      });
    }

    // Fetch all trips that user joined
    const trips = await organizer.find({
      _id: { $in: traveler.tripsJoined },
    });

    return res.status(200).json({
      success: true,
      data: trips,
    });

  } catch (error) {
    console.error("Error fetching registered trips:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const deleteRegisteredTrip = async (req, res) => {
  try {
    const userId = req.user._id;  // logged-in user
    const { tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({
        success: false,
        message: "Trip ID is required",
      });
    }

    // 1️⃣ Find traveler profile
    const traveler = await Traveler.findOne({ authId: userId });
    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: "Traveler not found",
      });
    }

    // 2️⃣ Check if user has joined this trip
    const joinedIndex = traveler.tripsJoined.findIndex(
      (t) => t.toString() === tripId
    );

    if (joinedIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Trip not found in traveler list",
      });
    }

    // 3️⃣ Remove trip from traveler list
    traveler.tripsJoined.splice(joinedIndex, 1);
    await traveler.save();

    // 4️⃣ Decrease trip participantCount
    const trip = await organizer.findById(tripId);

    if (trip) {
      if (typeof trip.participantCount === "number") {
        trip.participantCount = Math.max(0, trip.participantCount - 1);
      } else {
        trip.participantCount = 0; // fallback
      }

      await trip.save();
    }

    return res.status(200).json({
      success: true,
      message: "Trip unregistered successfully",
    });
  } catch (err) {
    console.error("Error in deleteRegisteredTrip:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};




export const creatediary = async (req, res, next) => {
  try {
    const { title, date, yourstory } = req.body;
    const diary = await Diary.create({
      title,
      date,
      yourstory,
      traveler: req.user._id
 
    });
    res.status(200).json({ success: true, data: diary });
  } catch (error) {
    next(error);
  }
};

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

export const viewall = async (req, res, next) => {
  try {
    const diaries = await Diary.find({ traveler: req.user._id });
    res.status(200).json({ success: true, count: diaries.length, diaries });
  } catch (error) {
    next(error);
  }
};

export const deletediary = async (req, res, next) => {
  try {
    const diary = await Diary.findOneAndDelete({ _id: req.params.id});
    if (!diary) {
      return res.status(404).json({ success: false, message: "Diary not found or unauthorized" });
    }
    res.status(200).json({ success: true, data: diary });
  } catch (error) {
    next(error);
  }
};

export const editdiary = async (req, res, next) => {
  try {
    const diary = await Diary.findOneAndUpdate(
      { _id: req.params.id, traveler: req.user._id },
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
    const { tripId, rating, review } = req.body;

    if (!tripId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "tripId, rating, and review are required.",
      });
    }

    const traveler = await Traveler.findOne({ authId: req.user._id });
    if (!traveler) {
      return res.status(404).json({
        success: false,
        message: "Traveler not found",
      });
    }

    const create = await reviewandrate.create({
      tripId,
      TravelerId: traveler._id,
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
    const traveler = req.user._id; // auth id

    const notify = await notification
      .find({ traveler }) // ✅ CORRECT FIELD
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notify.length,
      data: notify,
    });
  } catch (error) {
    next(error);
  }
};


export const viewonenotify = async (req, res, next) => {
  try {
    const traveler = req.user._id;
    const notifyId = req.params.id;

    const notify = await notification.findById(notifyId);

    if (!notify) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notify.traveler.toString() !== traveler.toString()) {
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

  

export const marknotification = async (req, res, next) => {
  try {
    const travelerId = req.user._id; 
    const notifyId = req.params.id; 

    const notify = await notification.findById(notifyId);

    if (!notify) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

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
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const traveler = await Traveler.findOne({ authId: req.user._id }).populate({
      path: "tripsJoined",
      model: "organizer",
      select: "title location startDate endDate tripPhoto price description participants",
    });

    if (!traveler) {
      return res.status(200).json({
        success: true,
        upcoming: [],
        past: [],
      });
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);


    const upcoming = [];
    const past = [];

    traveler.tripsJoined.forEach((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      console.log("Trip:", trip.title);
      console.log("Start:", start.toISOString());
      console.log("End:", end.toISOString());


      if (start >= now) {
        upcoming.push(trip);
      } 

      else if (end < now) {
        past.push(trip);
      } 
      else {
        upcoming.push(trip);
      }

      
    });

    console.log("FINAL UPCOMING:", upcoming.length);
    console.log("FINAL PAST:", past.length);

    return res.status(200).json({
      success: true,
      upcoming,
      past,
    });

  } catch (err) {
    console.error("Error fetching trips:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const countparticipants = async (req, res) => {
  try {
    const { id: tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({
        success: false,
        message: "Trip ID is required",
      });
    }

    // Travelers
    const travelers = await Traveler.find({
      tripsJoined: { $in: [tripId] },
    })
      .select("name email photo createdAt authId")
      .sort({ createdAt: 1 });

    // Organizers
    const organizers = await Auth.find({
      tripsJoined: { $in: [tripId] }
    }).select("username email createdAt _id");

    // ✅ MERGE ARRAYS CORRECTLY
    const participants = [...travelers, ...organizers];

    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants.map(p => ({
        _id: p._id,
        authId: p.authId || p._id,   // ✅ organizer has no authId
        name: p.name || p.username, // ✅ fallback
        email: p.email,
        photo: p.photo || null,
        joinedAt: p.createdAt,
        role: p.role || "Traveler"
      })),
    });

  } catch (error) {
    console.error("countparticipants error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const countTraveler = async (req, res) => {
  try {
    const count = await Traveler.countDocuments();

    return res.status(200).json({
      success: true,
      data: count
    });
  } catch (error) {
    console.error("Count traveler error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch traveler count"
    });
  }
};


export const contact = async (req, res, next) => {
  try {
    const travelerId = req.user._id;  

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

    if (!location) {
      const trips = await organizer.find();
      return res.status(200).json({
        success: true,
        data: trips,
        message: "No location provided, returning all trips",
      });
    }

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


