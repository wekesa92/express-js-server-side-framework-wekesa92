import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import logger from "./middleware/logger.js";
import auth from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(logger);

// Protected routes (require API key)
app.use("/api/products", auth, productRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Express.js RESTful API with Middleware 🧠");
});

// Error handler (must come last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
