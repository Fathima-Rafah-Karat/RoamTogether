import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: [true, "photo is required"],
    },
    govtIdType: {
      type: String,
      required: [true, "govtIdType is required"],
      enum: ["driving license", "aadhar card"],
    },
    govtIdPhoto: {
      type: String,
      required: [true, "govtIdPhoto is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
  },
  { timestamps: true }
);

const verification = mongoose.model("verification", verificationSchema);
export default verification;
