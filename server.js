require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: 'ds3yf359g',
  api_key: '842899395338262',
  api_secret: '3CyiC4RL1x9CDbiaXqFopEpDW-c',
});

// Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });

// Mongoose model
const mongooseSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  imageUrl: String,
  imagePublicId: String,
});
const User = mongoose.model("UserApi", mongooseSchema);

// Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// ✅ CREATE USER
app.post("/api/users", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageUrl = req.file.path;
    const imagePublicId = req.file.filename;

    const newUser = new User({
      name,
      email,
      password,
      imageUrl,
      imagePublicId,
    });
    await newUser.save();

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ GET ALL USERS
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ UPDATE USER
app.put("/api/users/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;

    if (req.file) {
      if (user.imagePublicId) {
        await cloudinary.uploader.destroy(user.imagePublicId);
      }
      user.imageUrl = req.file.path;
      user.imagePublicId = req.file.filename;
    }

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update user", details: err.message });
  }
});

// ✅ DELETE USER
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete user", details: err.message });
  }
});

// DB + Server Start
mongoose
  .connect('mongodb+srv://amitkumarsingh1482:amit1234@document.dkfjdwr.mongodb.net/document')
  .then(() => {
    console.log("MongoDB connected");
    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));


