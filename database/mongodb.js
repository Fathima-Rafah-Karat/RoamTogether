// import mongoose from "mongoose";
// import { DB_URI,NODE_ENV } from "../config/env.js";

// // if(!DB_URI){
// //     throw new Error ("please define MONGODB_URI");  
// // }
//  const connectToDatabase=async()=>{
//         try{
//             await mongoose.connect(DB_URI)
//             console.log(`connected to db in ${NODE_ENV} mode`);
//         }
//         catch(error){
//             console.log("error connecting to db:",error);
//             process.exit(1);
//         }
//     }
//     export default connectToDatabase;

// database/mongodb.js
import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

const connectToDatabase = async () => {
  try {
    if (!DB_URI) {
      throw new Error("DB_URI is missing");
    }

    await mongoose.connect(DB_URI);
    console.log(`✅ Connected to DB in ${NODE_ENV || "production"} mode`);
  } catch (error) {
    console.error("❌ Error connecting to DB:", error.message);
    process.exit(1);
  }
};

export default connectToDatabase;


// import mongoose from "mongoose";
// import { DB_URI, NODE_ENV } from "../config/env.js";

// const connectToDatabase = async () => {
//   if (!DB_URI) {
//     console.error("❌ MONGODB_URI is not defined. Please set it in your environment variables.");
//     process.exit(1);
//   }

//   try {
//     await mongoose.connect(DB_URI);
//     console.log(`✅ Connected to DB in ${NODE_ENV} mode`);
//   } catch (error) {
//     console.error("❌ Error connecting to DB:", error.message);
//     process.exit(1);
//   }
// };

// export default connectToDatabase;
