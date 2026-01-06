import { Router } from "express";
import * as AdminController from "../controllers/admin.controller.js";
import ensureAuthenticated from "../middleware/authenticate.js";


const router = Router();

/**
 * @route GET /admin
 * @desc Get all Admin users
 * @access Public
 */
router.get("/", AdminController.getAllInventory);


/**
 * @route   GET /admin/users
 * @desc    Fetch all registered users (for debugging/admin)
 * @access  Private (Authenticated)
 */
router.get("/users", ensureAuthenticated, AdminController.getUsers);


/**
 * @route   GET /admin/stats
 * @desc    Quick count of users by login method
 */
router.get("/stats", ensureAuthenticated, AdminController.getStats);

export default router;
