import { AdminRepository } from "../repositories/admin.repository.js";

/**
 * AdminService
 * Handles high-level business logic. 
 * Now refactored to use AdminRepository for all database interactions.
 */
export const AdminService = {

  /**
   * Aggregates key metrics for the Admin Dashboard.
   * Logic: Combines counts and revenue data into one object.
   */
  getSystemStats: async () => {
    // We call the repository methods instead of the Models
    const counts = await AdminRepository.getSystemCounts();
    const revenue = await AdminRepository.getTotalRevenue();

    return {
      ...counts,
      revenue
    };
  },

  /**
   * Fetches all users for management.
   */
  getAllUsers: async () => {
    return await AdminRepository.findAllUsers();
  },

  /**
   * Business Logic: Update user role.
   * Ensures that if a user is made a manager, a hotel ID is provided.
   */
  updateUserRole: async (userId, role, assignedHotelId = null) => {
    // Business Rule: A manager MUST be assigned to a hotel
    if (role === 'manager' && !assignedHotelId) {
      throw new Error("Managers must be assigned to a specific hotel location.");
    }

    const updatedUser = await AdminRepository.updateUserRole(userId, role, assignedHotelId);
    
    if (!updatedUser) {
      throw new Error("User not found or update failed.");
    }

    return updatedUser;
  },

  /**
   * Fetches the global audit of all hotels and rooms.
   */
  getGlobalInventory: async () => {
    return await AdminRepository.getGlobalInventoryAudit();
  }
};