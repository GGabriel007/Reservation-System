import mongoose from "mongoose";

/**
 * Transaction Schema
 * Purpose: Permanent financial audit trail for Stripe payments.
 * * Fields:
 * - reservationId: Link to the booking this payment belongs to.
 * - stripePaymentIntentId: The primary Stripe ID for tracking the flow.
 * - amount: The total amount processed (in decimals, e.g., 150.00).
 * - status: The outcome of the payment (succeeded, failed, refunded).
 * - last4: The last 4 digits of the card (for the User's "Wallet" view).
 */
const TransactionSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  // To support the "Global Admin" managing multiple locations
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "usd",
  },
  status: {
    type: String,
    enum: ["succeeded", "failed", "refunded", "processing"],
    default: "processing",
    required: true,
  },
  // Useful for the Guest Dashboard "Saved Cards" or "History" section
  paymentMethodDetails: {
    brand: String, // e.g., "visa", "mastercard"
    last4: String, 
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
 * Transactions should rarely be deleted, but this keeps the logic consistent.
 */
TransactionSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);