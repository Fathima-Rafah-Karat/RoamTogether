import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
 
  title: {
    type: String,
    required: [true, "Blog title is required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Blog story is required"],
    minlength: 50,
  }
 
},{timestamps:true});
 const blog=mongoose.model("blog",blogSchema);
 export default blog;