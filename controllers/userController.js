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
