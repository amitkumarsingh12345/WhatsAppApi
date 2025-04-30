import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { getUsers, registerUser } from "../controllers/userController.js"; // ✅ Add .js extension (ESM required)

const router = express.Router();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")), // ✅ safer path
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Route: POST /api/users/register
router.post("/register", upload.single("profileImage"), registerUser);
router.get("/register", getUsers);

export default router;
