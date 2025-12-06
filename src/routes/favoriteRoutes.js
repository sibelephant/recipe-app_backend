import express from "express";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/favoriteController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken); // All favorite routes require auth

router.get("/", getFavorites);
router.post("/:id", addFavorite);
router.delete("/:id", removeFavorite);

export default router;
