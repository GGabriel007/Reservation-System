import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

//  PUBLIC ROUTES  
// Anyone can look up a reservation with a confirmation code
router.get("/lookup", ReservationController.getReservationByLookup);

// Cancel a reservation
router.patch("/:id/cancel", ReservationController.cancelReservation);

// THE SECURITY GATE 
// Everything below this line requires a valid login session
router.use(protect); 


// STATIC ROUTES (Must come BEFORE dynamic /:id routes) ---

// View "My Bookings" history
router.get("/my-bookings", ReservationController.getMyReservations);

// Admin: View every single reservation in the system
router.get("/all", authorize('admin', 'manager'), ReservationController.getAllReservations);


// DYNAMIC ROUTES (Using Parameters) 

// Get specific reservation details
// Note: ReservationController.getReservationById should handle the logic
router.get("/:id", ReservationController.getReservationById);

// Manager/Admin: View all reservations for a specific hotel location
router.get(
  "/hotel/:hotelId", 
  authorize("admin", "manager"), 
  ReservationController.getReservationsByHotel
);

// Manager/Admin: Manually update booking status
router.patch(
  "/:id/status", 
  authorize("admin", "manager"), 
  ReservationController.updateStatus
);

export default router;