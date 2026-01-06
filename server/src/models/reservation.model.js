import mongoose from "mongoose";

/**
 * Reservation Schema
 * Defines the structure of reservation documents in the MongoDB collection.
 * Fields:
 * - roomNumber: Reference to the reserved room (String, required)
 * - userId: Reference to the user who made the reservation (ObjectId, required)
 * - startTime: Start time of the reservation (Date, required)
 * - endTime: End time of the reservation (Date, required)
 * - status: Current status of the reservation (String, enum: ['pending', 'failed, 'confirmed', 'cancelled'], default: 'pending')
 * - reservationNumber: Unique identifier for the reservation (ObjectId, required, unique, auto-generated)
 */
const ReservationSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    ref: "Room",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "failed", "confirmed", "cancelled"],
    default: "pending",
  },
  reservationNumber: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    auto: true,
  },
});

export const Reservation = mongoose.model("Reservation", ReservationSchema);
