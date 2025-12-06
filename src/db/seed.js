import { db } from "./index.js";
import { users, recipes } from "./schema.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  console.log("Seeding database...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(recipes);
    await db.delete(users);

    // Create Users
    console.log("Creating users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const usersData = [
      {
        username: "chef_mario",
        email: "mario@example.com",
        password: hashedPassword,
      },
      {
        username: "baker_luigi",
        email: "luigi@example.com",
        password: hashedPassword,
      },
      {
        username: "cook_peach",
        email: "peach@example.com",
        password: hashedPassword,
      },
    ];

    const createdUsers = await db.insert(users).values(usersData).returning();
    console.log(`Created ${createdUsers.length} users.`);

    // Create Recipes
    console.log("Creating recipes...");
    const recipesData = [
      // Mario's Recipes
      {
        title: "Spaghetti Bolognese",
        description: "A classic Italian meat sauce served over spaghetti.",
        ingredients: [
          "Spaghetti",
          "Ground Beef",
          "Tomato Sauce",
          "Onion",
          "Garlic",
        ],
        instructions:
          "1. Boil pasta. 2. Brown beef. 3. Add sauce and simmer. 4. Serve.",
        prepTime: 15,
        cookTime: 45,
        servings: 4,
        authorId: createdUsers[0].id,
        isDaily: true,
      },
      {
        title: "Mushroom Risotto",
        description: "Creamy rice dish with mushrooms.",
        ingredients: [
          "Arborio Rice",
          "Mushrooms",
          "Chicken Broth",
          "Parmesan",
          "White Wine",
        ],
        instructions:
          "1. Sauté mushrooms. 2. Toast rice. 3. Add broth slowly. 4. Stir in cheese.",
        prepTime: 20,
        cookTime: 40,
        servings: 4,
        authorId: createdUsers[0].id,
      },
      // Luigi's Recipes
      {
        title: "Margherita Pizza",
        description: "Simple pizza with tomato, mozzarella, and basil.",
        ingredients: [
          "Pizza Dough",
          "Tomato Sauce",
          "Mozzarella",
          "Fresh Basil",
        ],
        instructions:
          "1. Roll dough. 2. Add sauce and cheese. 3. Bake at 450F. 4. Top with basil.",
        prepTime: 30,
        cookTime: 15,
        servings: 2,
        authorId: createdUsers[1].id,
      },
      {
        title: "Tiramisu",
        description: "Coffee-flavored Italian dessert.",
        ingredients: [
          "Ladyfingers",
          "Mascarpone",
          "Espresso",
          "Cocoa Powder",
          "Eggs",
        ],
        instructions:
          "1. Dip ladyfingers in coffee. 2. Layer with mascarpone mixture. 3. Dust with cocoa.",
        prepTime: 40,
        cookTime: 0,
        servings: 8,
        authorId: createdUsers[1].id,
      },
      // Peach's Recipes
      {
        title: "Peach Cobbler",
        description: "Sweet dessert with fresh peaches and a biscuit topping.",
        ingredients: ["Peaches", "Sugar", "Flour", "Butter", "Milk"],
        instructions:
          "1. Slice peaches. 2. Make batter. 3. Pour batter over peaches. 4. Bake.",
        prepTime: 25,
        cookTime: 50,
        servings: 6,
        authorId: createdUsers[2].id,
      },
      {
        title: "Vegetable Stir Fry",
        description: "Quick and healthy vegetable stir fry.",
        ingredients: [
          "Broccoli",
          "Carrots",
          "Bell Peppers",
          "Soy Sauce",
          "Ginger",
        ],
        instructions:
          "1. Chop veggies. 2. Stir fry in wok. 3. Add sauce. 4. Serve with rice.",
        prepTime: 15,
        cookTime: 10,
        servings: 2,
        authorId: createdUsers[2].id,
      },
    ];

    await db.insert(recipes).values(recipesData);
    console.log(`Created ${recipesData.length} recipes.`);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
