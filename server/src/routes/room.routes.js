// /api/rooms/...

import { Router } from "express";
import { RoomController } from "../controllers/room.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

/**
 * PUBLIC ROUTES
 * Guests need to see rooms to make a reservation.
 */
router.get("/", RoomController.getAllRooms);
router.get("/amenities", RoomController.getAllRoomAmenities);
router.get("/:id", RoomController.getRoomById);
router.get("/hotel/:hotelId", protect, RoomController.getRoomsByHotel);

/**
 * PROTECTED ROUTES
 * Only Staff (Admin/Manager) can manage inventory.
 */

// Create a room (Admin or Manager of that hotel)
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  upload.array("images", 5),
  RoomController.createRoom
);

// Update room details (Price, amenities, etc.)
router.put(
  "/:id",
  protect,
  authorize("admin", "manager"),
  upload.array("images", 5),
  RoomController.updateRoom
);

// Soft Delete a room
router.delete(
  "/:id",
  protect,
  authorize("admin", "manager"),
  RoomController.deleteRoom
);

export default router;
