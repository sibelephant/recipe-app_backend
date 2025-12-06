import express from "express";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// Public route to view comments
router.get("/", getComments);

// Protected routes
router.post("/", authenticateToken, addComment);
router.delete("/:id", authenticateToken, deleteComment);

export default router;
