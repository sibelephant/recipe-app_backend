import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import { startDailyRecipeJob } from "./jobs/dailyRecipeJob.js";

const app = express();
const PORT = ENV.PORT;

// Start Cron Jobs
startDailyRecipeJob();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/recipes", recipeRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port:`, PORT);
});
