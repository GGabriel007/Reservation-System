import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Database Connection Module
 * Handles connection lifecycle between the Node.js runtime and AWS DocumentDB.
 */

dotenv.config();

// ESM fix: __dirname isn't global in ES modules. 
// Manually resolve absolute path to locate .pem file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function connectDB() {
  const DB_URL = process.env.MONGO_URL;

  const isProduction = process.env.NODE_ENV === "production";

  if (!DB_URL) {
    console.error("MONGO_URL not found in environment variables");
    process.exit(1);
  }

  // DocumentDB connection requirements:
    //  tls: Enforce encryption.
    //  replicaSet: Must be 'rs0' for AWS clusters.
    //  readPreference: Offload reads to replicas for scaling.
    //  retryWrites: Disable; not supported by DocumentDB engine.

  const awsOptions = {
    tls: true,
    tlsCAFile: path.join(__dirname, "../global-bundle.pem"),
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  };

  try {


    await mongoose.connect(DB_URL, isProduction ? awsOptions : {});

    console.log(`SUCCESS: Connected to testing databases ${isProduction ? "AWS DocumentDB" : "Local MongoDB"}`);
  } catch (error) {
    console.error(`FAILED TO CONNECT TO DB: ${error.message}`);
    process.exit(1);
  }
}