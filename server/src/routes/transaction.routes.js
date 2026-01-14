import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

// All transaction routes require login
router.use(protect);

/**
 * GUEST ROUTES
 * Viewing their own payment receipts.
 */
router.get("/my-payments", TransactionController.getMyTransactions);

/**
 * ADMIN & MANAGER ROUTES
 * Financial tracking and auditing.
 */

// Global Admin: See every single cent processed in the system
router.get(
  "/", 
  authorize("admin"), 
  TransactionController.getAllTransactions
);

// Manager: See revenue/payments for their specific hotelimport { Transaction } from "../models/transaction.model.js";

export const TransactionRepository = {
  
  // CREATE
  create: async (data) => {
    return await Transaction.create(data);
  },

  // GET ALL (Global Admin)
  // We populate here so the dashboard shows real names
  findAll: async () => {
    return await Transaction.find()
      .populate("userId", "firstName lastName email") 
      .populate("hotelId", "name city")
      .populate("reservationId", "confirmationCode")
      .sort({ createdAt: -1 });
  },

  // GET BY USER (Guest History)
  findByUserId: async (userId) => {
    return await Transaction.find({ userId })
      .populate("hotelId", "name city") 
      .populate("reservationId", "confirmationCode checkIn checkOut")
      .sort({ createdAt: -1 });
  },

  // GET BY HOTEL (Manager Report)
  findByHotelId: async (hotelId) => {
    return await Transaction.find({ hotelId })
      .populate("userId", "firstName lastName email")
      .populate("reservationId", "confirmationCode")
      .sort({ createdAt: -1 });
  },

  // GET ONE
  findById: async (id) => {
    return await Transaction.findById(id)
      .populate("userId", "firstName lastName email")
      .populate("hotelId", "name address")
      .populate("reservationId");
  },

  // UPDATE STATUS
  updateStatus: async (id, status) => {
    return await Transaction.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
  }
};
router.get(
  "/hotel/:hotelId", 
  authorize("admin", "manager"), 
  TransactionController.getTransactionsByHotel
);

// Get specific transaction details (e.g., for a PDF receipt)
router.get(
  "/:id", 
  authorize("admin", "manager"), 
  TransactionController.getTransactionById
);

export default router;