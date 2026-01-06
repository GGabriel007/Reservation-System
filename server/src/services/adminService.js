// server/src/services/adminService.js
import { User } from "../models/user.model.js";

export const getAllUsers = async () => {
  // Find all users and exclude the password field
  return await User.find({}, "-password");
};

export const getUserStats = async () => {
  const total = await User.countDocuments();
  const google = await User.countDocuments({ loginMethod: "google" });
  const local = await User.countDocuments({ loginMethod: "local" });
  
  return { total, google, local };
};

export const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await adminService.getUserStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};