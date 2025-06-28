const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Doctor = require("../models/Doctor");

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
  slot.patient = null;
  await doctor.save();
  res.json({ message: "Anulowano wizytę" });
});

module.exports = router;
