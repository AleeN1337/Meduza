const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  time: Date,
  booked: { type: Boolean, default: false },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String },
  slots: [slotSchema],
});

module.exports = mongoose.model("Doctor", doctorSchema);
