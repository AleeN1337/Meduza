const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Użytkownik nie istnieje." });
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const allowed = ["firstName", "lastName", "phone", "country", "city"];
    const update = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });
    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
    }).select("-password");
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Błąd aktualizacji" });
  }
});

module.exports = router;
