import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Organizer",
    },
 senderId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "traveler",
   required: true 
  },
   
  senderName: { 
    type: String, 
    required: true 
  },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
