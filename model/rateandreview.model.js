import mongoose from "mongoose";

const reviewansrateSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },
    rating: { 
        type: Number, 
        required: true,
         min: 1,
          max: 5
         },
    review:
     { 
        type: String, 
        required: true, 
        minlength: 10 
    }
},{timestamps:true});
const reviewandrate= mongoose.model("reviewandrate",reviewansrateSchema);
export default reviewandrate;