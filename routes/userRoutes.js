const express = require("express");
const multer = require("multer");
const { storage, cloudinary } = require("../config/cloudinary");
const UserApi = require("../models/User");

const router = express.Router();
const upload = multer({ storage });

/**
 * Create User
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageUrl = req.file.path;

    const newUser = new UserApi({ name, email, password, imageUrl });
    await newUser.save();

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

/**
 * Get All Users
 */
router.get("/", async (req, res) => {
  try {
    const users = await UserApi.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * Update User
 */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserApi.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;

    if (req.file) {
      // Optional: delete old image from Cloudinary
      const oldPublicId = user.imageUrl?.split("/")?.pop()?.split(".")[0];
      if (oldPublicId) {
        await cloudinary.uploader.destroy(`uploads/${oldPublicId}`);
      }

      user.imageUrl = req.file.path;
    }

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update user", details: err.message });
  }
});

/**
 * Delete User
 */
router.delete("/:id", async (req, res) => {
  try {
    const user = await UserApi.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Optional: delete image from Cloudinary
    const publicId = user.imageUrl?.split("/")?.pop()?.split(".")[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`uploads/${publicId}`);
    }

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete user", details: err.message });
  }
});

module.exports = router;
