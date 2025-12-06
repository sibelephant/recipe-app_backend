import { CronJob } from "cron";
import { db } from "../db/index.js";
import { recipes } from "../db/schema.js";
import { sql, eq } from "drizzle-orm";

export const startDailyRecipeJob = () => {
  // Run every day at midnight
  const job = new CronJob("0 0 * * *", async () => {
    console.log("Running daily recipe job...");
    try {
      // Reset all recipes
      await db.update(recipes).set({ isDaily: false });

      // Select a random recipe
      const [randomRecipe] = await db
        .select({ id: recipes.id })
        .from(recipes)
        .orderBy(sql`RANDOM()`)
        .limit(1);

      if (randomRecipe) {
        await db
          .update(recipes)
          .set({ isDaily: true })
          .where(eq(recipes.id, randomRecipe.id));
        console.log(`New daily recipe set: ${randomRecipe.id}`);
      } else {
        console.log("No recipes found to set as daily.");
      }
    } catch (error) {
      console.error("Error running daily recipe job:", error);
    }
  });

  job.start();
  console.log("Daily recipe job started.");
};
