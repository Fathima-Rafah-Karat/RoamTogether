import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
       status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
},{timestamps:true});
 const admin=mongoose.model("Admin",adminSchema);
 export default admin;
