import { db } from "../db/index.js";
import { recipes, users } from "../db/schema.js";
import { eq, ilike, and, or, sql } from "drizzle-orm";

export const searchRecipes = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = await db
      .select()
      .from(recipes)
      .where(
        or(
          ilike(recipes.title, `%${query}%`),
          ilike(recipes.description, `%${query}%`)
        )
      )
      .limit(20);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prep_time,
      cook_time,
      servings,
      image_url,
    } = req.body;
    const authorId = req.user.id;

    if (!title || !description || !instructions) {
      return res
        .status(400)
        .json({ message: "Title, description, and instructions are required" });
    }

    const [newRecipe] = await db
      .insert(recipes)
      .values({
        title,
        description,
        ingredients,
        instructions,
        prepTime: prep_time,
        cookTime: cook_time,
        servings,
        imageUrl: image_url,
        authorId,
      })
      .returning();

    res
      .status(201)
      .json({ id: newRecipe.id, message: "Recipe created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (search) {
      whereClause = ilike(recipes.title, `%${search}%`);
    }

    const data = await db
      .select()
      .from(recipes)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(recipes)
      .where(whereClause);

    res.json({
      data,
      pagination: {
        total: parseInt(count),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDailyRecipe = async (req, res) => {
  try {
    const [dailyRecipe] = await db
      .select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        prep_time: recipes.prepTime,
        cook_time: recipes.cookTime,
        author_id: recipes.authorId,
      })
      .from(recipes)
      .where(eq(recipes.isDaily, true));

    if (!dailyRecipe) {
      return res.status(404).json({ message: "No daily recipe set" });
    }

    res.json(dailyRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [recipe] = await db
      .select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        ingredients: recipes.ingredients,
        instructions: recipes.instructions,
        prep_time: recipes.prepTime,
        cook_time: recipes.cookTime,
        servings: recipes.servings,
        author: {
          id: users.id,
          username: users.username,
        },
      })
      .from(recipes)
      .leftJoin(users, eq(recipes.authorId, users.id))
      .where(eq(recipes.id, id));

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    // Map snake_case to camelCase for DB columns if needed, or just pass what matches
    // The schema uses camelCase keys (prepTime) but DB columns are snake_case (prep_time).
    // Drizzle handles the mapping if we use the schema keys.
    // The input body uses snake_case per spec (prep_time).

    const updateData = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.ingredients) updateData.ingredients = updates.ingredients;
    if (updates.instructions) updateData.instructions = updates.instructions;
    if (updates.prep_time) updateData.prepTime = updates.prep_time;
    if (updates.cook_time) updateData.cookTime = updates.cook_time;
    if (updates.servings) updateData.servings = updates.servings;
    if (updates.image_url) updateData.imageUrl = updates.image_url;

    const [updatedRecipe] = await db
      .update(recipes)
      .set(updateData)
      .where(and(eq(recipes.id, id), eq(recipes.authorId, userId)))
      .returning();

    if (!updatedRecipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found or unauthorized" });
    }

    res.json({ message: "Recipe updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [deletedRecipe] = await db
      .delete(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.authorId, userId)))
      .returning();

    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found or unauthorized" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
