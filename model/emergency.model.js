 import mongoose from "mongoose";
 
 const emergencySchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:[true,"name is required"]
    },
    phone:{
        type:String,
        required:[true,"phone number is required"],
        unique:true,
        match:[/^\+?[1-9]\d{1,14}$/,"please fill the valid phone_number"]
    },
    relation:{
        type:String,
        required:[true,"relationship is required"],
        
    }
 },{timestamps:true});
 const Emergency=mongoose.model("emergencycontact",emergencySchema);
 export default Emergency;