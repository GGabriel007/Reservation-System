import { Router } from "express";
import { HotelController } from "../controllers/hotel.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = Router();

/**
 * PUBLIC ROUTES
 * Anyone (Guests) can view hotels and search for locations.
 */
router.get("/", HotelController.getAllHotels);        
router.get("/:id", HotelController.getHotelById);      

/**
 * PROTECTED & AUTHORIZED ROUTES
 * Only Staff can modify hotel data.
 */

// Global Admins can register new hotels
router.post(
  "/", 
  protect, 
  authorize("admin"), 
  HotelController.createHotel
);

// Admins and assigned Managers can update hotel details
router.put(
  "/:id", 
  protect, 
  authorize("admin", "manager"), 
  HotelController.updateHotel
);

// Soft Delete: Only Global Admins can remove a location
router.delete(
  "/:id", 
  protect, 
  authorize("admin"), 
  HotelController.deleteHotel
);

export default router;