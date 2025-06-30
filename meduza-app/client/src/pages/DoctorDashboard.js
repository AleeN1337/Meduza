import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    if (!token) {
      navigate("/doctor-login");
      return;
    }

    axios
      .get("http://localhost:5000/api/doctor-dashboard", {
        headers: { Authorization: token },
      })
      .then((res) => setDoctor(res.data.doctor))
      .catch(() => {
        localStorage.removeItem("doctorToken");
        navigate("/doctor-login");
      });
  }, []);
  const confirmVisit = async (slotId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/doctors/${doctor._id}/confirm`,
        { slotId },
        { headers: { Authorization: token } }
      );
      const res = await axios.get(
        "http://localhost:5000/api/doctor-dashboard",
        {
          headers: { Authorization: token },
        }
      );
      setDoctor(res.data.doctor);
    } catch {}
  };

  if (!doctor) return <p>Ładowanie...</p>;

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center pt-[65px] text-white"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />
      <div className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Witaj dr {doctor.name}</h2>
        <h3 className="text-xl font-semibold mb-2">Oczekujące wizyty</h3>
        <ul className="mb-4">
          {doctor.slots
            .filter((s) => s.booked && !s.confirmed)
            .map((slot) => (
              <li
                key={slot._id}
                className="mb-2 flex justify-between items-center"
              >
                <span>
                  {new Date(slot.time).toLocaleString()} -{" "}
                  {slot.patient?.firstName} {slot.patient?.lastName}
                </span>
                <button
                  onClick={() => confirmVisit(slot._id)}
                  className="ml-2 bg-primary px-2 py-1 rounded"
                >
                  Akceptuj
                </button>
              </li>
            ))}
        </ul>
        <h3 className="text-xl font-semibold mb-2">Potwierdzone wizyty</h3>
        <ul>
          {doctor.slots
            .filter((s) => s.booked && s.confirmed)
            .map((slot) => (
              <li key={slot._id} className="mb-2">
                {new Date(slot.time).toLocaleString()} -{" "}
                {slot.patient?.firstName} {slot.patient?.lastName}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorDashboard;
