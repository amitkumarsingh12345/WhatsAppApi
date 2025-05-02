const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  imageUrl: String,
});

module.exports = mongoose.model("UserApi", userSchema);
