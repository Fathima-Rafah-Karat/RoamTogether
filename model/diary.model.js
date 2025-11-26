 import mongoose from "mongoose";
 
 const diarySchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:[true,"title is required"]
    },
    date:{
        type:Date,
        required:[true,"date is required"]
    },
    yourstory:{
        type:String,
        required:[true,"yourstory is required"],
        minlength:25
    },
      traveler: { type: mongoose.Schema.Types.ObjectId, ref: "Traveler", required: true }

 },{timestamps:true});
 const Diary=mongoose.model("diary",diarySchema);
 export default Diary;