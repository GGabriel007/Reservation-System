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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

  guestFirstName: { 
    type: String, 
    trim: true, 
    required: function() { return !this.userId; } 
  },
  guestLastName: { 
    type: String, 
    trim: true, 
    required: function() { return !this.userId; } 
  },
  guestEmail: { 
    type: String, 
    lowercase: true, 
    trim: true, 
    required: function() { return !this.userId; } 
  },
  guestPhone: { 
    type: String, 
    trim: true, 
    required: function() { return !this.userId; } 
  },
  guestAddress: {
    country: { type: String, default: "USA" },
    city: { type: String, trim: true },
    zipCode: { type: String, trim: true }
  },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  bedPreference: { type: String, default: "Not Specified" },
  specialRequests: { type: String, default: "" },

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

  // FINANCIAL DATA (From Figma Price Details Box)
  roomPrice: { type: Number, required: true }, 
  tax: { type: Number, default: 0 },
  fees: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true }, 

  // PAYMENT & STATUS (Security Note: We store Cardholder Name, but NOT full card number)
  paymentInfo: {
    cardHolderName: { type: String, trim: true },
    lastFour: { type: String, trim: true } // Storing only the last 4 digits is standard for reference
  },
  newsletterSubscription: { type: Boolean, default: false },

  status: { type: String, enum: ["pending", "confirmed", "cancelled", "failed"], default: "confirmed" },
  confirmationCode: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).substring(2, 9).toUpperCase()
  },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

/**
 * SOFT DELETION MIDDLEWARE
 */
ReservationSchema.pre(/^find/, function() {
  this.where({ isDeleted: { $ne: true } });
});

export const Reservation = mongoose.model("Reservation", ReservationSchema);