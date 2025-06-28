const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const Doctor = require("./models/Doctor");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rejestracja i logowanie
app.use("/api/auth", authRoutes);
// Chronione dane użytkownika
app.use("/api/dashboard", dashboardRoutes);
// Operacje na lekarzach i wizytach
app.use("/api/doctors", doctorRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Połączono z MongoDB");
    const count = await Doctor.countDocuments();
    if (count === 0) {
      await Doctor.insertMany([
        {
          name: "Mateusz Marecki",
          specialty: "Kardiolog",
          slots: [
            { time: new Date(Date.now() + 86400000) },
            { time: new Date(Date.now() + 2 * 86400000) },
            { time: new Date(Date.now() + 3 * 86400000) },
          ],
        },
        {
          name: "Anna Nowak",
          specialty: "Dermatolog",
          slots: [
            { time: new Date(Date.now() + 86400000) },
            { time: new Date(Date.now() + 2 * 86400000) },
          ],
        },
      ]);
      console.log("📄 Dodano przykładowych lekarzy");
    }
    app.listen(PORT, () => console.log(`🚀 Serwer działa na porcie ${PORT}`));
  })
  .catch((err) => console.error("❌ Błąd połączenia z MongoDB:", err));
