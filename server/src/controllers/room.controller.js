// Room CRUD & search logic
import { RoomService } from "../services/room.service.js";

/**
 * RoomController
 * Handles HTTP requests for room inventory.
 * Bridges the API routes to the RoomService logic.
 */
export const RoomController = {

  // GET ALL ROOMS
  getAllRooms: async (req, res) => {
    try {
      const rooms = await RoomService.getAllRooms();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rooms", error: error.message });
    }
  },

  // GET ROOM BY ID
  getRoomById: async (req, res) => {
    try {
      const room = await RoomService.getRoomById(req.params.id);
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ message: "Error fetching room details", error: error.message });
    }
  },

  // GET ROOMS BY HOTEL (Crucial for the "Hotel Details" page)
  getRoomsByHotel: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const rooms = await RoomService.getRoomsByHotel(hotelId);
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rooms for this hotel", error: error.message });
    }
  },

  // CREATE NEW ROOM
  createRoom: async (req, res) => {
    try {
      // roomData should include the hotelId
      const newRoom = await RoomService.createRoom(req.body);
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(400).json({ message: "Failed to create room", error: error.message });
    }
  },

  // UPDATE ROOM
  updateRoom: async (req, res) => {
    try {
      const updatedRoom = await RoomService.updateRoom(req.params.id, req.body);
      if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(400).json({ message: "Failed to update room", error: error.message });
    }
  },

  // DELETE ROOM (Soft Delete)
  deleteRoom: async (req, res) => {
    try {
      const deletedRoom = await RoomService.deleteRoom(req.params.id);
      if (!deletedRoom) return res.status(404).json({ message: "Room not found" });
      res.status(200).json({ message: "Room successfully deactivated" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting room", error: error.message });
    }
  }
};