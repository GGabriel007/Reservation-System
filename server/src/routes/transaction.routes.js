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

// Manager: See revenue/payments for their specific hotel
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