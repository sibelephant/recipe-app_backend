import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { startDailyRecipeJob } from "./jobs/dailyRecipeJob.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const swaggerDocument = require("./docs/swagger.json");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = ENV.PORT;
app.use(morgan("dev"));

// Start Cron Jobs
startDailyRecipeJob();

app.use(
  cors({
    origin: ENV.ALLOWED_ORIGINS
      ? ENV.ALLOWED_ORIGINS.split(",")
      : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/recipes", recipeRoutes);
app.use("/api/v1/recipes/:id/comments", commentRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/favorites", favoriteRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port:`, PORT);
});
