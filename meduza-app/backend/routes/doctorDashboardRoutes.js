const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Doctor = require("../models/Doctor");

router.get("/", auth, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Brak uprawnień" });
  }
  try {
    const doctor = await Doctor.findById(req.user.id)
      .populate("slots.patient", "firstName lastName email")
      .select("-password");
    if (!doctor)
      return res.status(404).json({ message: "Lekarz nie istnieje." });
    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera" });
  }
});

module.exports = router;
