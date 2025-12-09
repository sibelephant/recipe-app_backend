import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { upload, uploadToCloudinary } from "../middleware/uploadMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only authenticated users can upload images
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  uploadToCloudinary,
  uploadImage
);

export default router;
