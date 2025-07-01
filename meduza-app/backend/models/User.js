const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  country: { type: String },
  city: { type: String },
  role: { type: String, default: "patient" },
  notifications: [notificationSchema],
});

module.exports = mongoose.model("User", userSchema);
