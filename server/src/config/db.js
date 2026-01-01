//  MongoDB / DocumentDB connection
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  const DB_URL =
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_LOCAL_URL
      : process.env.MONGO_URL;

  if (!DB_URL) {
    console.error("MONGO_URL not found in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URL);
    console.log(`CONNECTED TO DB: ${DB_URL}`);
  } catch (error) {
    // abort app if we cannot connect to db
    console.error(
      `FAILED TO CONNECT TO MONGO DB AT CONNECTION: ${DB_URL}. Error: ${error}`
    );
    process.exit(1);
  }
}
