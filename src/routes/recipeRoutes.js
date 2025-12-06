import express from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getDailyRecipe,
  searchRecipes,
} from "../controllers/recipeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getRecipes);
router.get("/daily", getDailyRecipe);
router.get("/search", searchRecipes);
router.get("/:id", getRecipeById);
router.post("/", authenticateToken, createRecipe);
router.put("/:id", authenticateToken, updateRecipe);
router.delete("/:id", authenticateToken, deleteRecipe);

export default router;
