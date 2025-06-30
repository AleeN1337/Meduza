import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Visits = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, []); // eslint-disable-line

  const fetchAppointments = () => {
    axios
      .get("http://localhost:5000/api/doctors/my", {
        headers: { Authorization: token },
      })
      .then((res) => {
        const fetched = Array.isArray(res.data) ? res.data : [];
        setAppointments(fetched);
      })
      .catch((err) => console.error("Błąd pobierania wizyt:", err));
  };

  const handleCancel = (doctorId, slotId) => {
    axios
      .post(
        `http://localhost:5000/api/doctors/${doctorId}/cancel`,
        { slotId },
        { headers: { Authorization: token } }
      )
      .then(fetchAppointments)
      .catch((err) => console.error("Błąd anulowania:", err));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center pt-[65px] text-white"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />
      <div className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Moje wizyty</h2>
        <ul className="mb-6 space-y-2">
          {appointments.length ? (
            appointments.map((ap) => (
              <li key={ap.slotId} className="flex items-center justify-between">
                <span>
                  {ap.doctorName} ({ap.specialty}) -{" "}
                  {new Date(ap.time).toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCancel(ap.doctorId, ap.slotId)}
                    className="bg-red-600 px-2 py-1 rounded"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={() => navigate("/calendar")}
                    className="bg-blue-600 px-2 py-1 rounded"
                  >
                    Przełóż
                  </button>
                  <button className="bg-green-600 px-2 py-1 rounded">
                    PDF
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>Brak wizyt.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Visits;
