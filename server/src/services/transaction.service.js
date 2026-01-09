import { TransactionRepository } from "../repositories/transaction.repository.js";

/**
 * TransactionService
 * Logic for financial auditing, revenue tracking, and payment history.
 */
export const TransactionService = {

  /**
   * Internal/System Logic: Create a transaction record.
   * This is typically called after a successful Stripe webhook 
   * or a completed checkout session.
   */
  createTransaction: async (transactionData) => {
    // Business Logic: Ensure amount is valid
    if (transactionData.amount <= 0) {
      throw new Error("Transaction amount must be greater than zero");
    }

    // Standardize currency to uppercase (e.g., usd -> USD)
    const formattedData = {
      ...transactionData,
      currency: transactionData.currency?.toUpperCase() || "USD"
    };

    return await TransactionRepository.create(formattedData);
  },

  /**
   * Fetches payment history for a specific guest.
   */
  getTransactionsByUser: async (userId) => {
    return await TransactionRepository.findByUserId(userId);
  },

  /**
   * Fetches revenue records for a specific hotel.
   * Essential for Manager-level reporting.
   */
  getTransactionsByHotel: async (hotelId) => {
    return await TransactionRepository.findByHotelId(hotelId);
  },

  /**
   * Admin logic: View global financial data.
   */
  getAllTransactions: async () => {
    return await TransactionRepository.findAll();
  },

  /**
   * Fetches a single transaction for detailed receipts/invoices.
   */
  getTransactionById: async (id) => {
    const transaction = await TransactionRepository.findById(id);
    if (!transaction) {
      throw new Error("Transaction record not found");
    }
    return transaction;
  },

  /**
   * Logic for processing a refund status change.
   */
  updateTransactionStatus: async (id, status) => {
    const validStatuses = ["paid", "refunded", "failed"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid transaction status");
    }
    return await TransactionRepository.updateStatus(id, status);
  }
};