// Stripe checkout & webhooks

import { TransactionService } from "../services/transaction.service.js";

/**
 * TransactionController
 * Handles financial records and payment tracking.
 */
export const TransactionController = {

  // GET GUEST'S OWN TRANSACTIONS
  getMyTransactions: async (req, res) => {
    try {
      // Security: Only fetch transactions belonging to the logged-in user
      const transactions = await TransactionService.getTransactionsByUser(req.user.id);
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching your payment history", error: error.message });
    }
  },

  // GET ALL TRANSACTIONS (Admin Only)
  getAllTransactions: async (req, res) => {
    try {
      const allTransactions = await TransactionService.getAllTransactions();
      res.status(200).json(allTransactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching global financial records", error: error.message });
    }
  },

  // GET BY HOTEL (Admin/Manager)
  getTransactionsByHotel: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const transactions = await TransactionService.getTransactionsByHotel(hotelId);
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching revenue for this hotel", error: error.message });
    }
  },

  // GET SPECIFIC TRANSACTION BY ID
  getTransactionById: async (req, res) => {
    try {
      const transaction = await TransactionService.getTransactionById(req.params.id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction record not found" });
      }

      // Security Check: Guests can only see their own transaction details
      if (req.user.role === 'guest' && transaction.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access to this receipt" });
      }

      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transaction details", error: error.message });
    }
  }
};