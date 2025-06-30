const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  time: Date,
  location: String,
  booked: { type: Boolean, default: false },
  confirmed: { type: Boolean, default: false },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});
const notificationSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String },
  pwz: { type: String },
  password: { type: String, required: true },
  mustChangePassword: { type: Boolean, default: false },
  specialty: { type: String },
  visible: { type: Boolean, default: false },
  tempPassword: { type: String },
  notifications: [notificationSchema],
  slots: [slotSchema],
});

module.exports = mongoose.model("Doctor", doctorSchema);
