import express from "express";
import { ENV } from "./config/env.js";

const app = express();
const PORT = ENV.PORT;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port:`, PORT);
});


