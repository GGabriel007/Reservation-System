import mongoose from "mongoose";

/**
 * Room Schema
 * Defines the structure of room documents.
 * Links to a specific Hotel and tracks pricing/capacity.
 * * Fields:
 * - roomName: Identifier for the room (e.g., "Room 302")
 * - roomType: Enum category (single, double, suite)
 * - basePrice: Cost per night (Requirement: pricing)
 * - maxOccupancy: Max guests allowed (Requirement: capacity)
 * - hotel: Reference to the parent Hotel document
 * - isDeleted: Soft delete flag for inventory management
 */
const RoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    trim: true,
  },
  roomType: {
    type: String,
    enum: ["single", "double", "suite"],
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  maxOccupancy: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
    default: [],
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { 
  timestamps: true 
});

/**
 * SOFT DELETION MIDDLEWARE
 */
RoomSchema.pre(/^find/, function() {
  this.where({ isDeleted: { $ne: true } });
});

export const Room = mongoose.model("Room", RoomSchema);