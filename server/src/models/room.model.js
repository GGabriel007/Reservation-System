import mongoose from "mongoose";

/**
 * Room Schema
 * Defines the structure of room documents in the MongoDB collection.
 * Fields:
 * - roomName: Name of the room (String, required)
 * - roomType: Type of the room (String, enum: ['single', 'double', 'suite'], required)
 * - price: Price per night for the room (Number, required)
 * - numGuests: Maximum number of guests allowed in the room (Number, required)
 * - amenities: List of amenities available in the room (Array of Strings, optional)
 * - availabilityStatus: Current availability status of the room (String, enum: ['available', 'occupied', 'maintenance'], default: 'available')
 * - images: URLs of images of the room (Array of Strings, optional)
 * - hotel: Reference to the Hotel document this room belongs to (ObjectId, ref: 'Hotel', required)
 */
const RoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    enum: ["single", "double", "suite"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  numGuests: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
    required: false,
  },
  availabilityStatus: {
    type: String,
    enum: ["available", "occupied", "maintenance", "pending"],
    default: "available",
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
});

export const Room = mongoose.model("Reservation", RoomSchema);
