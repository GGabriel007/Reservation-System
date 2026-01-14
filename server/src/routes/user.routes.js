import express from "express";
import { UserController } from "../controllers/user.controller.js";
// CHANGE: Import 'protect' instead of 'verifyToken'
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Route: GET /users
// Desc: Get all users (Protected)
router.get("/", protect, UserController.getAllUsers);

// Route: PUT /users/:id/role
// Desc: Update a specific user's role
router.put("/:id/role", protect, UserController.updateUserRole);

// Route: DELETE /users/:id
// Desc: Permanently delete a user
router.delete("/:id", protect, UserController.deleteUser);

export default router;