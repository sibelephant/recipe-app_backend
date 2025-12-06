import { db } from "../db/index.js";
import { comments, users } from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";

export const addComment = async (req, res) => {
  try {
    const { id: recipeId } = req.params;
    const { text, rating } = req.body;
    const userId = req.user.id;

    if (!text || !rating) {
      return res.status(400).json({ message: "Text and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        text,
        rating,
        userId,
        recipeId,
      })
      .returning();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getComments = async (req, res) => {
  try {
    const { id: recipeId } = req.params;

    const recipeComments = await db
      .select({
        id: comments.id,
        text: comments.text,
        rating: comments.rating,
        createdAt: comments.createdAt,
        user: {
          id: users.id,
          username: users.username,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.recipeId, recipeId))
      .orderBy(desc(comments.createdAt));

    res.json(recipeComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user.id;

    const [deletedComment] = await db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
      .returning();

    if (!deletedComment) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
