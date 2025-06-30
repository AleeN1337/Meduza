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
  });
  await doctor.save();
  res.json({ message: "Lekarz dodany", username, password: plainPassword });
});

// zwróć wszystkich lekarzy z terminami
router.get("/", auth, async (req, res) => {
  const doctors = await Doctor.find();
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
  await doctor.save();
  res.json({ message: "Zarezerwowano termin" });
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
