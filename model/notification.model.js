import mongoose from "mongoose";

const notificationSchema= new mongoose.Schema({
      traveler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: true
    },
    message: {
      type: String,
      required: [true, "Message is required"]
    },
    type: {
      type: String,
    //   info for general msg ,trip for trip related msg, alert for important notification
      enum: ["info", "trip", "alert"],
      default: "info"
    },
    isRead: {
      type: Boolean,
      default: false
    }
},{timestamps:true});
const notification =mongoose.model("notification",notificationSchema);
export default notification;