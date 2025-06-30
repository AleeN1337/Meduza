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
  const nextAppointment = appointments
    .slice()
    .sort((a, b) => new Date(a.time) - new Date(b.time))[0];

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
        <h3 className="text-xl font-semibold mb-2">
          Najbliższa zaplanowana wizyta
        </h3>
        {nextAppointment ? (
          <p className="mb-4">
            {nextAppointment.doctorName} ({nextAppointment.specialty}) -{" "}
            {new Date(nextAppointment.time).toLocaleString()}
          </p>
        ) : (
          <p className="mb-4">Brak zaplanowanych wizyt.</p>
        )}
        <h3 className="text-xl font-semibold mb-2">Status ostatnich wyników</h3>
        <p className="mb-4">Brak nowych wyników badań.</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/calendar")}
            className="bg-primary px-4 py-2 rounded"
          >
            Umów wizytę
          </button>
          <button
            onClick={() => navigate("/visits")}
            className="bg-primary px-4 py-2 rounded"
          >
            Historia wizyt
          </button>
          <button
            onClick={() => navigate("/messages")}
            className="bg-primary px-4 py-2 rounded"
          >
            Wiadomości
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
