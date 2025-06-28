import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: token },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });

    fetchAppointments();
  }, []);

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

  if (!user) return <p>Ładowanie...</p>;

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center pt-[65px] text-white"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />
      <div className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Witaj {user.firstName}</h2>

        <h3 className="text-xl font-semibold mb-2">Zaplanowane wizyty</h3>
        <ul className="mb-6 space-y-2">
          {appointments.length ? (
            appointments.map((ap) => (
              <li key={ap.slotId}>
                {ap.doctorName} ({ap.specialty}) -{" "}
                {new Date(ap.time).toLocaleString()}
                <button
                  onClick={() => handleCancel(ap.doctorId, ap.slotId)}
                  className="ml-2 bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Anuluj
                </button>
              </li>
            ))
          ) : (
            <p>Brak wizyt.</p>
          )}
        </ul>
        <h3 className="text-xl font-semibold mb-2">Twoje recepty</h3>
        <p>Brak wystawionych recept.</p>
      </div>
    </div>
  );
};

export default Dashboard;
