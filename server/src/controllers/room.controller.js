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
      const rooms = await Room.find().populate("hotel", "name location");
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ message: "Error fetching rooms", error: err.message });
    }
  },

  // GET ROOM BY ID
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id).populate("hotel");
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.status(200).json(room);
    } catch (err) {
      res.status(500).json({ message: "Error fetching room", error: err.message });
    }
  },

  // Get Rooms by Hotel (For your Admin Panel)
  getRoomsByHotel: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const rooms = await Room.find({ hotel: hotelId });
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ message: "Error fetching hotel inventory", error: err.message });
    }
  },

  // GET ROOMS BY HOTEL
  getRoomsByHotel: async (req, res) => {
    try {
      const { hotelId } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (req.user.role === 'manager') {
        const managerHotelId = req.user.assignedHotel?.toString();
        if (managerHotelId !== hotelId) {
          return res.status(403).json({ message: "Unauthorized for this hotel" });
        }
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
      const { roomName, roomType, basePrice, maxOccupancy, description, amenities, hotel, availabilityStatus } = req.body;

      // Handle Image: If Multer processed a file, it will be in req.file
      let imagePaths = [];
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map(file => `/uploads/${file.filename}`);
      }

      const newRoom = new Room({
        roomName,
        roomType,
        basePrice,
        maxOccupancy,
        description,
        amenities: Array.isArray(amenities) ? amenities : [amenities],
        hotel,
        images: imagePaths,
        availabilityStatus: availabilityStatus || "available",
      });

      const savedRoom = await newRoom.save();
      res.status(201).json(savedRoom);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create room", error: err.message });
    }
  },

  // UPDATE ROOM (Fixed Logic)
  updateRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body; // Contains text fields AND 'existingImages'

      // Handle Existing Images
      // Multer puts text fields in req.body.
      // If we sent multiple 'existingImages', it's an array. If one, it's a string.
      let keptImages = updates.existingImages || [];

      // Normalize to array if it's a single string
      if (!Array.isArray(keptImages)) {
        keptImages = [keptImages];
      }

      // Handle New Uploads
      let newPaths = [];
      if (req.files && req.files.length > 0) {
        newPaths = req.files.map(file => `/uploads/${file.filename}`);
      }

      // Combine them
      // We do NOT use "room.images" from the DB anymore. 
      // We fully trust the frontend's "keptImages" + "newPaths".
      updates.images = [...keptImages, ...newPaths];

      const updatedRoom = await Room.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedRoom) return res.status(404).json({ message: "Room not found" });

      res.status(200).json(updatedRoom);
    } catch (err) {
      res.status(500).json({ message: "Failed to update room", error: err.message });
    }
  },

  // DELETE ROOM
  deleteRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const room = await Room.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

      if (!room) return res.status(404).json({ message: "Room not found" });

      res.status(200).json({ message: "Room deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete room", error: err.message });
    }
  },
};