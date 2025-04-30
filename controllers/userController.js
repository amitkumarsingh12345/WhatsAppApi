import { WhatsAppApi } from "../models/user.js"; // ✅ Ensure `.js` extension is included (ESM required)

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profileImage = req.file?.filename || "";

    console.log("000000000000");

    const user = new WhatsAppApi({ name, email, password, profileImage });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Server error while registering user." });
  }
};

// Get Users Api

export const getUsers = async (req, res) => {
  try {
    const users = await WhatsAppApi.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Delete User Api

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await WhatsAppApi.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};
