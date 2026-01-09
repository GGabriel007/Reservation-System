import { Transaction } from "../models/transaction.model.js";

/**
 * TransactionRepository
 * Direct database access for financial records.
 * Joins User, Hotel, and Reservation data for reporting.
 */
export const TransactionRepository = {

  /**
   * Create a new transaction record.
   * Usually triggered by a successful Stripe payment.
   */
  create: async (transactionData) => {
    return await Transaction.create(transactionData);
  },

  /**
   * Get all transactions (Global Admin View).
   * Populates key data for the master spreadsheet.
   */
  findAll: async () => {
    return await Transaction.find()
      .populate("userId", "name email")
      .populate("hotelId", "name")
      .populate("reservationId", "checkIn checkOut")
      .sort({ createdAt: -1 });
  },

  /**
   * Get a single transaction by ID.
   * Useful for generating a specific invoice/receipt.
   */
  findById: async (id) => {
    return await Transaction.findById(id)
      .populate("userId", "name email")
      .populate("hotelId", "name address")
      .populate("reservationId");
  },

  /**
   * Find transactions for a specific user.
   * Used for the "Payment History" section in the Guest profile.
   */
  findByUserId: async (userId) => {
    return await Transaction.find({ userId })
      .populate("hotelId", "name")
      .sort({ createdAt: -1 });
  },

  /**
   * Find transactions for a specific hotel.
   * This powers the Manager's revenue charts.
   */
  findByHotelId: async (hotelId) => {
    return await Transaction.find({ hotelId })
      .populate("userId", "name")
      .populate("reservationId", "totalAmount")
      .sort({ createdAt: -1 });
  },

  /**
   * Update payment status.
   * Used for processing refunds or handling chargebacks.
   */
  updateStatus: async (id, status) => {
    return await Transaction.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }
};