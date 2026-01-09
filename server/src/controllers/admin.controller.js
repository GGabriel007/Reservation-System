import { AdminService } from "../services/admin.service.js";

/**
 * AdminController
 * High-level management operations for the entire platform.
 */
export const AdminController = {

  // 1. SYSTEM-WIDE STATISTICS
  // Powers the charts and "Total Revenue" cards on the Dashboard
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
  // Fetches everyone: Guests, Managers, and Admins
  getAllUsers: async (req, res) => {
    try {
      const users = await AdminService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user database" });
    }
  },

  // ROLE MANAGEMENT
  // Allows Gabriel to promote a Guest to a Manager or Admin
  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role, assignedHotel } = req.body; // assignedHotel is used if promoting to Manager
      
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

  // GLOBAL INVENTORY AUDIT
  // One view to see every hotel and every room currently in the system
  getAllInventory: async (req, res) => {
    try {
      const inventory = await AdminService.getGlobalInventory();
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Error fetching global inventory audit" });
    }
  }
};