// Room CRUD & search logic
import { RoomService } from "../services/room.service.js";
import { Room } from "../models/room.model.js";

/**
 * RoomController
 * Handles HTTP requests for room inventory.
 * Bridges the API routes to the RoomService logic.
 */
export const RoomController = {
  // GET ALL ROOMS
  getAllRooms: async (req, res) => {
    try {
      const { name, price, search, ...filters } = req.query;
      let rooms;
      if (name) {
        rooms = await RoomService.getAllRoomsSorted(
          name,
          "name",
          search,
          Object.keys(filters)
        );
      } else if (price) {
        rooms = await RoomService.getAllRoomsSorted(
          price,
          "price",
          search,
          Object.keys(filters)
        );
      } else {
        rooms = await RoomService.getAllRooms();
      }
      res.status(200).json(rooms);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching rooms", error: error.message });
    }
  },

  // GET ALL ROOMS' AMENITIES
  getAllRoomAmenities: async (req, res) => {
    try {
      const amenities = await RoomService.getAllRoomAmenities();
      res.status(200).json({ amenities: amenities });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching room details", error: error.message });
    }
  },

  // GET ROOM BY ID
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id).populate("hotel");
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.status(200).json(room);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching room details", error: error.message });
    }
  },

  // Get Rooms by Hotel (For your Admin Panel)
  getRoomsByHotel: async (req, res) => {
    try {
      const { hotelId } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Security: Manager check
      if (
        req.user.role === "manager" &&
        req.user.assignedHotel?.toString() !== hotelId
      ) {
        return res.status(403).json({ message: "Unauthorized for this hotel" });
      }

      const rooms = await RoomService.getRoomsByHotel(hotelId);
      res.status(200).json(rooms);
    } catch (error) {
      console.error("GET_ROOMS_ERROR:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // CREATE NEW ROOM
  createRoom: async (req, res) => {
    try {
      const roomData = {
        ...req.body,
        hotel: req.body.hotel || req.body.hotelId,
      };

      // Security: Ensure a manager can only create rooms for their assigned hotel
      if (
        req.user.role === "manager" &&
        req.user.assignedHotel?.toString() !== roomData.hotel
      ) {
        return res
          .status(403)
          .json({ message: "You can only add rooms to your own hotel." });
      }

      const newRoom = await RoomService.createRoom(roomData);
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // UPDATE ROOM
  updateRoom: async (req, res) => {
    try {
      const roomId = req.params.id;

      // 1. Fetch the room first
      const room = await RoomService.getRoomById(roomId);
      if (!room) return res.status(404).json({ message: "Room not found" });

      // 2. SAFE ID EXTRACTION
      // Handle case where room.hotel is populated (Object) or not (String)
      const roomHotelId = room.hotel._id
        ? room.hotel._id.toString()
        : room.hotel.toString();

      const userHotelId = req.user.assignedHotel
        ? req.user.assignedHotel.toString()
        : "";

      // 3. SECURITY: Manager check
      if (req.user.role === "manager" && roomHotelId !== userHotelId) {
        return res.status(403).json({
          message: "Unauthorized: You do not manage this room's hotel.",
        });
      }

      const updatedRoom = await RoomService.updateRoom(roomId, req.body);
      res.status(200).json(updatedRoom);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to update room", error: error.message });
    }
  },

  // DELETE ROOM (Soft Delete)
  deleteRoom: async (req, res) => {
    try {
      const { id } = req.params;

      const room = await RoomService.getRoomById(id);
      if (!room) return res.status(404).json({ message: "Room not found" });

      // 1. SAFE ID EXTRACTION
      const roomHotelId = room.hotel._id
        ? room.hotel._id.toString()
        : room.hotel.toString();

      const userHotelId = req.user.assignedHotel
        ? req.user.assignedHotel.toString()
        : "";

      // 2. SECURITY: Manager check
      if (req.user.role === "manager" && roomHotelId !== userHotelId) {
        return res.status(403).json({
          message: "Access denied: This room belongs to another property.",
        });
      }

      await RoomService.deleteRoom(id);
      res.status(200).json({ message: "Room soft-deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
