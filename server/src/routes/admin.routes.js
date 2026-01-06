import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import ensureAuthenticated from "../middleware/authenticate.js";


const router = Router();

/**
 * @route GET /admin
 * @desc Get all Admin users
 * @access Public
 */
router.get("/", AdminController.getAllInventory);

router.get("/", AdminController.getAllUsers);

/**
 * @route   GET /admin/users
 * @desc    Fetch all registered users (for debugging/admin)
 * @access  Private (Authenticated)
 */
router.get("/users", ensureAuthenticated, async (req, res) => {
  try {
    // We exclude the password field for security
    const users = await User.find({}, "-password"); 
    
    res.status(200).json({
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error fetching database data" });
  }
});

/**
 * @route   GET /admin/stats
 * @desc    Quick count of users by login method
 */
router.get("/stats", ensureAuthenticated, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const googleUsers = await User.countDocuments({ loginMethod: "google" });
    const localUsers = await User.countDocuments({ loginMethod: "local" });

    res.json({
      total: totalUsers,
      breakdown: {
        google: googleUsers,
        local: localUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating stats" });
  }
});

export default router;
