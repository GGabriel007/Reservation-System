import * as adminService from "../services/admin.service.js";

// AdminController.getUsers
export const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// MATCHES: AdminController.getStats
export const getStats = async (req, res) => {
  try {
    const stats = await adminService.getUserStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// NEW: Added this so the route doesn't crash!
export const getAllInventory = async (req, res) => {
  try {
    // For now, returning a placeholder until you have an Inventory model
    res.status(200).json({ message: "Inventory data coming soon" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory" });
  }
};