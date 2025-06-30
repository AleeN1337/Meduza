const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const generateUsername = (name) => {
  const [first, ...last] = name.split(" ");
  return first.charAt(0).toLowerCase() + last.join("").toLowerCase();
};

// dodaj lekarza (admin)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Brak uprawnień" });
  const { name, email, specialty, pwz } = req.body;
  const username = generateUsername(name);
  const plainPassword = Math.random().toString(36).slice(-8);
  const password = await bcrypt.hash(plainPassword, 10);
  const doctor = new Doctor({
    name,
    username,
    email,
    specialty,
    pwz,
    password,
    mustChangePassword: true,
    visible: true,
    tempPassword: plainPassword,
  });
  await doctor.save();
  res.json({ message: "Lekarz dodany", username, password: plainPassword });
});

// pełna lista lekarzy dla admina
router.get("/admin", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Brak uprawnień" });
  const doctors = await Doctor.find();
  res.json(doctors);
});

// zwróć wszystkich lekarzy z terminami
router.get("/", auth, async (req, res) => {
  const doctors = await Doctor.find({ visible: true });
  res.json(doctors);
});

// zwróć terminy użytkownika
router.get("/my", auth, async (req, res) => {
  const doctors = await Doctor.find({ "slots.patient": req.user.id });
  const result = [];
  doctors.forEach((doc) => {
    doc.slots.forEach((slot) => {
      if (slot.patient && slot.patient.toString() === req.user.id) {
        result.push({
          doctorId: doc._id,
          doctorName: doc.name,
          specialty: doc.specialty,
          slotId: slot._id,
          time: slot.time,
        });
      }
    });
  });
  res.json(result);
});

// rezerwacja terminu
router.post("/:id/book", auth, async (req, res) => {
  const { slotId } = req.body;
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor)
    return res.status(404).json({ message: "Nie znaleziono lekarza" });
  const slot = doctor.slots.id(slotId);
  if (!slot || slot.booked)
    return res.status(400).json({ message: "Termin zajęty" });
  slot.booked = true;
  slot.confirmed = false;
  slot.patient = req.user.id;
  const patient = await User.findById(req.user.id);
  doctor.notifications.push({
    message: `Nowa rezerwacja od ${patient.firstName} ${patient.lastName}`,
  });
  await doctor.save();
  res.json({ message: "Zarezerwowano termin" });
});
// edycja terminu
router.put("/me/slots/:slotId", auth, async (req, res) => {
  if (req.user.role !== "doctor")
    return res.status(403).json({ message: "Brak uprawnień" });
  const doctor = await Doctor.findById(req.user.id);
  if (!doctor) return res.status(404).json({ message: "Lekarz nie istnieje" });
  const slot = doctor.slots.id(req.params.slotId);
  if (!slot) return res.status(404).json({ message: "Termin nie istnieje" });
  if (slot.booked)
    return res
      .status(400)
      .json({ message: "Nie można edytować zajętego terminu" });
  if (req.body.time) slot.time = req.body.time;
  if (req.body.location) slot.location = req.body.location;
  await doctor.save();
  res.json({ message: "Zaktualizowano termin" });
});

// usunięcie terminu
router.delete("/me/slots/:slotId", auth, async (req, res) => {
  if (req.user.role !== "doctor")
    return res.status(403).json({ message: "Brak uprawnień" });
  const doctor = await Doctor.findById(req.user.id);
  if (!doctor) return res.status(404).json({ message: "Lekarz nie istnieje" });
  const slot = doctor.slots.id(req.params.slotId);
  if (!slot) return res.status(404).json({ message: "Termin nie istnieje" });
  if (slot.booked)
    return res
      .status(400)
      .json({ message: "Nie można usunąć zajętego terminu" });
  slot.remove();
  await doctor.save();
  res.json({ message: "Usunięto termin" });
});

// anulowanie wizyty
router.post("/:id/cancel", auth, async (req, res) => {
  const { slotId } = req.body;
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor)
    return res.status(404).json({ message: "Nie znaleziono lekarza" });
  const slot = doctor.slots.id(slotId);
  if (!slot || !slot.booked || slot.patient.toString() !== req.user.id) {
    return res.status(400).json({ message: "Nie można anulować" });
  }
  slot.booked = false;
  slot.confirmed = false;
  slot.patient = null;
  await doctor.save();
  res.json({ message: "Anulowano wizytę" });
});
// dodanie nowego terminu przez lekarza
router.post("/me/slots", auth, async (req, res) => {
  if (req.user.role !== "doctor")
    return res.status(403).json({ message: "Brak uprawnień" });
  const { time, location } = req.body;
  const doctor = await Doctor.findById(req.user.id);
  if (!doctor) return res.status(404).json({ message: "Lekarz nie istnieje" });
  doctor.slots.push({ time, location });
  await doctor.save();
  res.json({ message: "Dodano termin" });
});
// aktualizacja danych lekarza
router.put("/me", auth, async (req, res) => {
  if (req.user.role !== "doctor")
    return res.status(403).json({ message: "Brak uprawnień" });
  const allowed = ["email", "specialty", "pwz"];
  const update = {};
  allowed.forEach((f) => {
    if (req.body[f] !== undefined) update[f] = req.body[f];
  });
  const doctor = await Doctor.findByIdAndUpdate(req.user.id, update, {
    new: true,
  }).select("-password");
  res.json({ doctor });
});
// potwierdzenie wizyty przez lekarza
router.post("/:id/confirm", auth, async (req, res) => {
  const { slotId } = req.body;
  if (req.user.role !== "doctor" || req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Brak uprawnień" });
  }
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor)
    return res.status(404).json({ message: "Nie znaleziono lekarza" });
  const slot = doctor.slots.id(slotId);
  if (!slot || !slot.booked)
    return res.status(400).json({ message: "Nie można potwierdzić" });
  slot.confirmed = true;
  await doctor.save();
  res.json({ message: "Wizyta potwierdzona" });
});

module.exports = router;
