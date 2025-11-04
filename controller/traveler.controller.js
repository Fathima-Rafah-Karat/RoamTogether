import Traveler from "../model/traveler.model.js";
import organizer from "../model/organizer.model.js";
import Diary from "../model/diary.model.js";
import blog from "../model/blog.model.js";
import reviewandrate from "../model/rateandreview.model.js";
import notification from "../model/notification.model.js";

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

    // Check if traveler already exists
    let traveler = await Traveler.findOne({ email });

    if (!traveler) {
      // Create new traveler with this trip
      traveler = await Traveler.create({
        name,
        phone,
        email,
        photo,
        aadharcard,
        tripsJoined: tripId ? [tripId] : [],
      });
    } else {
      // If traveler exists, add the new trip (only if not already joined)
      if (!Array.isArray(Traveler.tripsJoined)) {
        traveler.tripsJoined = [];
      }

      if (tripId && !traveler.tripsJoined.includes(tripId)) {
        traveler.tripsJoined.push(tripId);
        await traveler.save();
      }
    }

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

export const createblog =async (req,res,next)=>{
    try{
       const {title,content}=req.body;
       const blogs=await blog.create({title,content});
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

export const reviewandrating=async(req,res,next)=>{
    try{
      const{tripId,rating,review}=req.body;
      const create=await reviewandrate.create({tripId,rating,review});
      res.status(200).json({
        success:true,
        data:create
      })
    }
    catch(error){
        next(error);
    }
}

export const viewratereview=async(req,res,next)=>{
  try{
    const rateandreview=await reviewandrate.find();
    res.status(200).json({
      success:true,
      data:rateandreview
    })
  }
  catch(error){
    next(error);
  }
}

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

export const countparticipants=async(req,res,next)=>{
  try{
   const {tripId}=req.params;
   const count =await Traveler.countDocuments({ tripsJoined: tripId });
   res.status(200).json({
    success:true,
    data:count
   })
  }
  catch(error){
    next(error)
  }
}

