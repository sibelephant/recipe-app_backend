import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").array(), // Storing as array of strings
  instructions: text("instructions").notNull(),
  prepTime: integer("prep_time"),
  cookTime: integer("cook_time"),
  servings: integer("servings"),
  authorId: integer("author_id").references(() => users.id),
  isDaily: boolean("is_daily").default(false), // For the daily recipe feature
  createdAt: timestamp("created_at").defaultNow(),
});
