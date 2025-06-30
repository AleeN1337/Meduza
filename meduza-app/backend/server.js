const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const doctorAuthRoutes = require("./routes/doctorAuthRoutes");
const doctorDashboardRoutes = require("./routes/doctorDashboardRoutes");
const Doctor = require("./models/Doctor");
const User = require("./models/User");

dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rejestracja i logowanie pacjentów
app.use("/api/auth", authRoutes);
// Logowanie lekarzy
app.use("/api/doctor-auth", doctorAuthRoutes);
// Chronione dane użytkownika
app.use("/api/dashboard", dashboardRoutes);
// Panel lekarza
app.use("/api/doctor-dashboard", doctorDashboardRoutes);
// Operacje na lekarzach i wizytach
app.use("/api/doctors", doctorRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Połączono z MongoDB");
    const count = await Doctor.countDocuments();
    if (count === 0) {
      const sample = [
        { name: "Mateusz Marecki", specialty: "Kardiolog" },
        { name: "Anna Nowak", specialty: "Dermatolog" },
      ];
      for (const doc of sample) {
        const username =
          doc.name.split(" ")[0][0].toLowerCase() +
          doc.name.split(" ").slice(1).join("").toLowerCase();
        const plain = Math.random().toString(36).slice(-8);
        const password = await bcrypt.hash(plain, 10);
        await Doctor.create({
          name: doc.name,
          username,
          password,
          specialty: doc.specialty,
          slots: [
            { time: new Date(Date.now() + 86400000) },
            { time: new Date(Date.now() + 2 * 86400000) },
          ],
        });
        console.log(`Lekarz: ${username} hasło: ${plain}`);
      }
    }
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      const adminPass = await bcrypt.hash("admin", 10);
      await User.create({
        firstName: "Admin",
        lastName: "Systemowy",
        email: "admin@meduza.pl",
        password: adminPass,
        role: "admin",
      });
      console.log("Utworzono konto administratora admin@meduza.pl / admin");
    }
    app.listen(PORT, () => console.log(`🚀 Serwer działa na porcie ${PORT}`));
  })
  .catch((err) => console.error("❌ Błąd połączenia z MongoDB:", err));
