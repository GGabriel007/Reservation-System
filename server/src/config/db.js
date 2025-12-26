//  MongoDB / DocumentDB connection

import mongoose from "mongoose";

export async function connectDB() {
  const DB_URL = "mongodb://127.0.0.1:27017/reservation-system";

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
