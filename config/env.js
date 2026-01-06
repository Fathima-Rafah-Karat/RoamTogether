// import { config } from "dotenv";
// config({path:`.env.${process.env.NODE_ENV  || 'development'}.local`});

// export const {
//     PORT,
//     NODE_ENV,
//     DB_URI,
//     JWT_SECRET,
//     JWT_EXPIRES_IN
// }=process.env;

import { config } from "dotenv";

// Load local .env only in development
if (process.env.NODE_ENV !== "production") {
  const envFile = `.env.${process.env.NODE_ENV || 'development'}.local`;
  config({ path: envFile });
}

// Export environment variables safely with defaults
export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DB_URI = process.env.MONGODB_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
