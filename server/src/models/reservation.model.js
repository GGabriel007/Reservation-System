import mongoose from "mongoose";

/**
 * Reservation Schema
 * The core transaction model linking Users, Rooms, and Hotels.
 * * Fields:
 * - userId: The guest who made the booking
 * - roomId: The specific room being booked
 * - hotelId: The hotel location (Crucial for Manager filtering)
 * - checkIn / checkOut: The dates of the stay
 * - totalAmount: The final price paid
 * - status: 'pending', 'confirmed', 'cancelled', 'failed'
 * - confirmationCode: Human-readable ID for guest lookups
 */
const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  // CRITICAL: Links the booking to a location for Manager Dashboards
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "failed"],
    default: "pending",
  },
  // Human-readable code for the "Check Reservation" page
  // We can use a shorter string or the auto-generated _id
  confirmationCode: {
    type: String,
    unique: true,
    default: function() {
      return Math.random().toString(36).substring(2, 9).toUpperCase();
    }
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { 
  timestamps: true 
});

/**
 * SOFT DELETION MIDDLEWARE
 */
ReservationSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Reservation = mongoose.model("Reservation", ReservationSchema);