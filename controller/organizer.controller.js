import notification from "../model/notification.model.js";
import organizer from "../model/organizer.model.js";


export const createTrip = async (req,res,next)=>{
    try{
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
         

        const trip=await organizer.create({ title,description,location,startDate,endDate,participants,inclusions,tripPhoto,price,inclusionspoint,exclusionspoint,planDetails:parsedPlanDetails});
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

export  const  viewtrip = async(req,res,next)=>{
    try{
       const view =await organizer.findById(req.params.id);
       if(!view){
        res.status(400).json({
            success:false,
            message:"user not found"
        })
       }
       res.status(200).json({
        success:true,
        data:view
       })
    }
    catch(error){
        next(error);
    }
}


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

export const createnotification = async(req,res,next)=>{
    try{
      const{travelerId,type,message,isRead}=req.body;
      const createnotify=await notification.create({travelerId,type,message,isRead});
      res.status(200).json({
        success:true,
        data:createnotify
      })
    }
    catch(error){
        next(error);
    }
}

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