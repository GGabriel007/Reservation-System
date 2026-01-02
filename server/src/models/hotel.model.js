import mongoose from "mongoose";

/**
 * Hotel Schema
 * Defines the structure of hotel documents in the MongoDB collection.
 * Fields:
 * - name: Name of the hotel (String, required)
 * - address: Address of the hotel (String, required)
 * - images: URLs of images of the hotel (Array of Strings, optional)
 */
const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  images: { type: [String], required: false },
});

export const Hotel = mongoose.model("Hotel", HotelSchema);
