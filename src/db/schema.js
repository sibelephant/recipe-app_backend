import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").array(), // Storing as array of strings
  instructions: text("instructions").notNull(),
  prepTime: integer("prep_time"),
  cookTime: integer("cook_time"),
  servings: integer("servings"),
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  imageUrl: text("image_url"),
  isDaily: boolean("is_daily").default(false), // For the daily recipe feature
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable(
  "favorites",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    recipeId: uuid("recipe_id")
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.recipeId] }),
  })
);

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
