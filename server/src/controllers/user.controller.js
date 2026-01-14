// Profile updates & loyalty points
import { User } from "../models/user.model.js";

export const UserController = {
  
  // GET ALL USERS
  // Returns a list of all users, sorted by newest first.
  // Security: We intentionally exclude the 'password' field.
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({})
        .select("-password") // Do not send passwords to client
        .sort({ createdAt: -1 });
      
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
    }
  },

  // UPDATE USER ROLE
  // Used to promote a Guest to Hotel Manager or Admin
  updateUserRole: async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // Expecting "guest", "manager", or "admin"

    // basic validation
    const validRoles = ["guest", "manager", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role: role },
        { new: true } // Return the updated document
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating role", error: error.message });
    }
  },


  // Permanently removes a user from the database
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  }

};