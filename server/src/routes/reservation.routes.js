import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

/**
 * PROTECTED ROUTES
 * All reservation actions require the user to be logged in.
 */
router.use(protect); 

// GUEST ACTIONS
// Create a new booking
router.post("/", ReservationController.createReservation);

// View "My Bookings" history
router.get("/my-bookings", ReservationController.getMyReservations);

// Get specific reservation details (for the confirmation page)
router.get("/:id", ReservationController.getReservationById);

// Cancel a reservation (Soft Delete or Status update)
router.patch("/:id/cancel", ReservationController.cancelReservation);


// STAFF & ADMIN ACTIONS
// Global Admin: View every single reservation in the system
router.get(
  "/", 
  authorize("admin"), 
  ReservationController.getAllReservations
);

// Manager: View all reservations for their specific hotel location
router.get(
  "/hotel/:hotelId", 
  authorize("admin", "manager"), 
  ReservationController.getReservationsByHotel
);

// Manager/Admin: Manually update booking status (e.g., 'confirmed' to 'checked-in')
router.patch(
  "/:id/status", 
  authorize("admin", "manager"), 
  ReservationController.updateStatus
);

export default router;