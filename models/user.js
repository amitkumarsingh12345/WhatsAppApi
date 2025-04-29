import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ Optional: prevent duplicate emails
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // ✅ Optional: adds createdAt and updatedAt
);

// Consider renaming the model to 'User' for clarity
export const WhatsAppApi = mongoose.model("WhatsAppApi", userSchema);
