const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginDoctor = async (req, res) => {
  const { username, password } = req.body;
  try {
    const doctor = await Doctor.findOne({ username });
    if (!doctor)
      return res.status(404).json({ message: "Lekarz nie istnieje." });
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Nieprawidłowe hasło." });
    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.json({
      message: "Zalogowano pomyślnie.",
      token,
      doctor: { name: doctor.name, username: doctor.username },
      mustChangePassword: doctor.mustChangePassword,
    });
  } catch (err) {
    res.status(500).json({ message: "Błąd logowania: " + err.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor)
      return res.status(404).json({ message: "Lekarz nie istnieje." });
    const ok = await bcrypt.compare(oldPassword, doctor.password);
    if (!ok)
      return res.status(401).json({ message: "Nieprawidłowe obecne hasło." });
    doctor.password = await bcrypt.hash(newPassword, 10);
    doctor.mustChangePassword = false;
    doctor.tempaPassword = null;
    await doctor.save();
    res.json({ message: "Hasło zmienione" });
  } catch (err) {
    res.status(500).json({ message: "Błąd zmiany hasła" });
  }
};

module.exports = { loginDoctor, changePassword };
