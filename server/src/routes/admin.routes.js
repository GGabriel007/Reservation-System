import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

// 1. PUBLIC BOOTSTRAP (Temporary)
// This is what you'll use to promote your account
router.post("/promote-self", AdminController.promoteSelf);

/**
 * ALL ADMIN ROUTES ARE PROTECTED
 * Only users with the "admin" role can access this entire file.
 */
router.use(protect);


// Temporary
router.get("/reservations/:hotelId", authorize("admin", "manager"), AdminController.getHotelReservations);
router.post("/rooms", authorize("admin", "manager"), AdminController.createRoom);

router.use(authorize("admin"));

router.delete("/users/:id", AdminController.deleteUser);
router.put("/hotels/:id", AdminController.updateHotel);
router.delete("/hotels/:id", AdminController.deleteHotel);
router.post("/hotels", AdminController.createHotel);

/**
 * @route   GET /api/admin/stats
 * @desc    Global dashboard stats (Total Revenue, Total Bookings, User counts)
 */
router.get("/stats", AdminController.getSystemStats);

/**
 * @route   GET /api/admin/users
 * @desc    Manage the user database (View all staff and guests)
 */
router.get("/users", AdminController.getAllUsers);

/**
 * @route   PATCH /api/admin/users/:id/role
 * @desc    Promote/Demote users (e.g., make a Guest a Manager)
 */
router.patch("/users/:id/role", AdminController.updateUserRole);

/**
 * @route   GET /api/admin/inventory
 * @desc    Global inventory audit (All Hotels + All Rooms)
 */
router.get("/inventory", AdminController.getAllInventory);

export default router;