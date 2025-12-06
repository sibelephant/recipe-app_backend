import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/config/env.js";

export default defineConfig({
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
});
