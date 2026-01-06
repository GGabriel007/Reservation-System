// server/src/config/db.js
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = (async () => {
  const isDev = process.env.NODE_ENV === "development";
  const DB_URL = isDev ? process.env.MONGO_LOCAL_URL : process.env.MONGO_URL;

  const options = {};

  if (!isDev) {
    // Correct path: up one level from 'config' into 'src'
    const caPath = path.resolve(__dirname, "../global-bundle.pem");
    
    if (fs.existsSync(caPath)) {
        options.tlsCAFile = caPath;
    } else {
        console.error("CRITICAL: Certificate not found at", caPath);
    }
  }

  try {
    await mongoose.connect(DB_URL, options);
    console.log("CONNECTED TO DB");
  } catch (error) {
    console.error("DB CONNECTION ERROR:", error.message);
    process.exit(1);
  }
})();

export default db;