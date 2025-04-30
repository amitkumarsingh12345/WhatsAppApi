import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://amitkumarsingh1482:amit1234@document.dkfjdwr.mongodb.net/document"
    );
    console.log("MongoDB Connected Successfully !!");
  } catch (error) {
    console.error("MongoDB connection failed !!");
  }
};
