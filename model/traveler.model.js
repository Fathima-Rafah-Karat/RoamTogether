import mongoose from "mongoose";
 const travelerSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
        minlength:3,
        maxlength:30
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,"please fill valid email"],
        unique:true
    },
    phone:{
        type:String,
        required:[true,"phone number is required"],
        unique:true,
        match:[/^\+?[1-9]\d{1,14}$/,"please fill the valid phone_number"]
    },
    photo:{
        type:String,
        required:[true,"photo is required"]
    },
    aadharcard:{
      type:String,
      required:[true,"aadhar card  photo is required"]
    },   
     authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true
  },
     tripsJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organizer", 
      },
    ],
 },{timestamps:true});
 const Traveler = mongoose.model("traveler",travelerSchema);
 export default Traveler;


