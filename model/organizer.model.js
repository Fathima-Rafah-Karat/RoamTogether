import mongoose from "mongoose";
const organizerSchema = new mongoose.Schema({
    title:{
      type:String,
      trim:true,
      required:[true,"title is required"]  ,
      minlength:3,
      maxlength:50
    },
    description:{
        type:String,
        required:[true,"description is required"],
        minlength:10
    },
    location:{
        type:String,
        required:[true,"location is required"]
    },
    startDate:{
        type:Date,
        required:[true,"startDate is required"]
    },
    endDate:{
        type:Date,
        required:[true,"endDate is required"]
    },
    participants:{
        type:Number,
        required:[true,"participants is required"]
    },
    inclusions:{
        meals:{
            type:Boolean,
            default:false
        },
        stay:{
            type:Boolean,
            default:false
        },
        transport:{
            type:Boolean,
            default:false
        },
        activites:{
            type:Boolean,
            default:false
        }
    },
    photo:{
        type:String,
        required:[true,"photo is required"]
    },
    price:{
        type:Number,
        required:[true,"price is required"]
    },
    inclusionspoint:[{
        type:String,
        required:[true,"inclusionspoint is required"]
    }],
    exclusionspoint:[{
        type:String,
        required:[true,"exclusionspoint is required"]
    }]

},{timestamps:true});
const organizer= mongoose.model("organizer",organizerSchema);
export default organizer;