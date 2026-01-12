import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const UserRepo = {
  /**
   * Get all users
   * @returns {Promise<Array>} Array of all users documents
   */
  getAllUsers: () => User.find(),

  /**
   * Find user by ID (Crucial for Passport Session)
   * @param {string} id 
   * @returns {Promise<Object|null>} user document
   */
  getUserById: async (id) => {
    // If it's not a valid hex ID, it might be a Google ID string 
    // or just a malformed request. Let's handle it gracefully.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // If your schema uses the Google ID as the primary key, search normally.
      // But if you use standard ObjectIds, we should search the googleId field:
      return await User.findOne({ googleId: id }); 
    }
    
    return await User.findById(id);
  },


  /**
   * Find users by email
   * @param {string} email - username to search for
   * @returns {Promise<Object>} user document
   */
  getUserByEmail: async (email) => {
    return await User.findOne({ email: email });
  },

  /**
   * Create new user
   * @param {Object} userData - data for the new user
   * @returns {Promise<Object>} created user document
   */
  createUser: async (userData) => {
    return User.create(userData);
  },

  /**
   * Find and update user by email
   * @param {string} email - email to search for
   * @param {Object} userData - data for the user to be updated
   * @returns {Promise<Object>} updated user document
   */
  updateUserByEmail: async (email, userData) => {
    return User.findOneAndUpdate({ email: email }, userData, { new: true });
  },

  /**
   * Delete user by email
   * @param {string} email
   * @returns {Promise<Object>} deleted user document
   */
  deleteUserByEmail: async (email) => {
    return User.findOneAndDelete({ email: email });
  },

  /**
   * Filter users by role
   * @param {string} role
   * @returns {Promise<Array>} Array of user documents with the specified role
   */
  filterRoles: async (role) => {
    return User.find({ role: role });
  },

  // Temporary method
  updateUserRole: async (userId, newRole) => {
      return await User.findByIdAndUpdate(
        userId, 
        { role: newRole }, 
        { new: true }
      );
  },

  /**
   * Delete user by ID
   * @param {string} id
   * @returns {Promise<Object>} deleted user document
   */
  deleteUserById: async (id) => {
    return await User.findByIdAndDelete(id);
  },


};
