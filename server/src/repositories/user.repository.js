import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const UserRepo = {
  /**
   * Get all users
   * @returns {Promise<Array>} Array of all users documents
   */
  getAllUsers: () => User.find(),

  /**
   * Find users by email
   * @param {string} email - username to search for
   * @returns {Promise<Object>} user document
   */
  getUserByEmail: async (email) => {
    const user = await User.findOne({ email: email });
    return user;
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
};
