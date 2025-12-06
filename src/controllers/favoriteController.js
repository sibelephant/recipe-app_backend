import { db } from "../db/index.js";
import { favorites, recipes } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export const addFavorite = async (req, res) => {
  try {
    const { id: recipeId } = req.params;
    const userId = req.user.id;

    // Check if recipe exists
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId));

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if already favorited
    const [existingFavorite] = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId))
      );

    if (existingFavorite) {
      return res.status(400).json({ message: "Recipe already favorited" });
    }

    await db.insert(favorites).values({
      userId,
      recipeId,
    });

    res.status(201).json({ message: "Recipe added to favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { id: recipeId } = req.params;
    const userId = req.user.id;

    const [deletedFavorite] = await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId))
      )
      .returning();

    if (!deletedFavorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Recipe removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const userFavorites = await db
      .select({
        recipe: recipes,
        favoritedAt: favorites.createdAt,
      })
      .from(favorites)
      .innerJoin(recipes, eq(favorites.recipeId, recipes.id))
      .where(eq(favorites.userId, userId));

    // Flatten the structure if needed, or return as is
    const formattedFavorites = userFavorites.map((f) => ({
      ...f.recipe,
      favoritedAt: f.favoritedAt,
    }));

    res.json(formattedFavorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
