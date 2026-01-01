import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const UserRepo = {
  /**
   * Get all users
   * @returns {Promise<Array>} Array of all users documents
   */
  getAllUsers: () => User.find(),

  /**
   * Find users by username
   * @param {string} username - username to search for
   * @returns {Promise<Object>} user document
   */
  getUserByName: async (username) => {
    const user = await User.find({ username: username });
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
};
