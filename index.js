import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"; // use correct variable name & .js extension
import { connectDB } from "./config/db.js"; // add .js extension if using ES Modules
import path from "path";
import { fileURLToPath } from "url";

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoutes);

// DB + Server Start
connectDB();
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
