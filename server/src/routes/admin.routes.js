import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";

const router = Router();

/**
 * @route GET /admin
 * @desc Get all Admin users
 * @access Public
 */
router.get("/", AdminController.getAllInventory);

router.get("/", AdminController.getAllUsers);

export default router;
