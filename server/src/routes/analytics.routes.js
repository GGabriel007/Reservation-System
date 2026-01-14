import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller.js";
import { protect } from "../middleware/authMiddleware.js"; // Only protect is here
import { authorize } from "../middleware/roleMiddleware.js"; // authorize is here

const router = Router();

// Only Admins should see the full business health
router.get("/dashboard", authorize("admin", "manager"), AnalyticsController.getDashboardStats);

export default router;