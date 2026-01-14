import { AdminService } from "../services/admin.service.js";
import { Reservation } from "../models/reservation.model.js";
import { Hotel } from "../models/hotel.model.js";

/**
 * AdminController
 * High-level management operations for the entire platform.
 */
export const AdminController = {

  // Temporary: The Bootstrap Method
  promoteSelf: async (req, res) => {
    try {
      const { email } = req.body;
      const updatedUser = await AdminService.promoteUserByEmail(email);
      res.status(200).json({ 
        message: "Success! You are now an administrator.", 
        user: updatedUser 
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // --- HOTEL MANAGEMENT ---

  // Create a new Hotel
  createHotel: async (req, res) => {
    try {
      const hotel = await Hotel.create(req.body);
      res.status(201).json(hotel);
    } catch (error) {
      console.error("Create Hotel Error:", error);
      res.status(400).json({ message: "Hotel creation failed", error: error.message });
    }
  },

  // FIX: Renamed from 'getAllInventory' to 'getFullInventory' to match your Routes!
  getFullInventory: async (req, res) => {
    try {
      // Fetches all hotels that are NOT soft-deleted
      const hotels = await Hotel.find({}).sort({ createdAt: -1 });
      res.status(200).json(hotels);
    } catch (error) {
      console.error("Fetch Inventory Error:", error);
      res.status(500).json({ message: "Error fetching global inventory audit" });
    }
  },

  // Update a Hotel
  updateHotel: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedHotel = await Hotel.findByIdAndUpdate(id, updates, { new: true });
      
      if (!updatedHotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.status(200).json(updatedHotel);
    } catch (err) {
      res.status(500).json({ message: "Error updating hotel", error: err.message });
    }
  },

  // Soft Delete a Hotel
  deleteHotel: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedHotel = await Hotel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      
      if (!deletedHotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.status(200).json({ message: "Hotel deactivated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting hotel" });
    }
  },

  // --- ROOM & SYSTEM MANAGEMENT ---

  createRoom: async (req, res) => {
    try {
      const room = await AdminService.createRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ message: "Room creation failed", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await AdminService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  },

  // SYSTEM-WIDE STATISTICS
  getSystemStats: async (req, res) => {
    try {
      const stats = await AdminService.getSystemStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ 
        message: "Error generating system report", 
        error: error.message 
      });
    }
  },

  // USER MANAGEMENT
  getAllUsers: async (req, res) => {
    try {
      const users = await AdminService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user database" });
    }
  },

  // ROLE MANAGEMENT
  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role, assignedHotel } = req.body; 
      
      const updatedUser = await AdminService.updateUserRole(id, role, assignedHotel);
      res.status(200).json({ 
        message: `User role updated to ${role}`, 
        user: updatedUser 
      });
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to update user role", 
        error: error.message 
      });
    }
  },

  getHotelReservations: async (req, res) => {
    try {
      const { hotelId } = req.params;
      
      const reservations = await Reservation.find({ hotelId: hotelId })
        .populate("userId", "firstName lastName email")
        .populate("roomId", "roomName roomType")
        .sort({ checkIn: -1 });

      res.status(200).json(reservations);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      res.status(500).json({ message: "Error fetching reservations" });
    }
  },
};