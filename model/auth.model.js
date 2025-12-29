import mongoose from "mongoose";
const authSchema=new mongoose.Schema({

    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        minlength:3,
        maxlength:30
    },
    email:{
        type:String,
        required:[true,"email is required "],
        trim:true,
        lowercase:true,
       unique:true,
        match:[/^\S+@\S+\.\S+$/,"please fill valid email"]
    },
    phone:{
        type:String,
        required:[true,"phone number is required"],
        unique:true,
        match:[/^\+?[1-9]\d{1,14}$/,"please fill the valid phone_number"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true,
        minlength:6
    },
    role:{
        type:String,
        required:[true,"select your role is required"],
        enum:["Traveler","Organizer","Admin"]
    },
     tripsJoined: [
             {
               type: mongoose.Schema.Types.ObjectId,
               ref: "organizer", 
             },
           ],
},{timestamps:true});
const Auth =mongoose.model("auth",authSchema);
export default Auth;