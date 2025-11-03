import mongoose from "mongoose";
const verificationSchema=new mongoose.Schema({
    photo:{
      type:String,
      required:[true,"photo is required"]
    },
      govtIdType:{
       type:String,
       required:[true,"govtIdType is required"],
       enum:["driving license","aadhar card"]
    },
    govtIdPhoto:{
         type:String,
        required:[true,"photo is required"]
    },
    socailMediaLink:{
        type:String,
        required:[true,"socailMediaLink is required"]
    }

},{timestamps:true})
const verification= mongoose.model("verification",verificationSchema);
export default verification;