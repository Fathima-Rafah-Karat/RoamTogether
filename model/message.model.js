import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Organizer",
    },
    // sender: {
    //   type: String, // later you can change to ObjectId (User)
    //   required: true,
    // },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
