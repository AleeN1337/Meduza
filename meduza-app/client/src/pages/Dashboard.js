import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Poprawiony useCallback, aby fetchAppointments nie powodował ostrzeżenia ESLint
  const fetchAppointments = useCallback(() => {
    axios
      .get("http://localhost:5000/api/doctors/my", {
        headers: { Authorization: token },
      })
      .then((res) => {
        const fetched = Array.isArray(res.data) ? res.data : [];
        setAppointments(fetched);
      })
      .catch((err) => console.error("Błąd pobierania wizyt:", err));
  }, [token]);

  // Poprawiony useEffect z kompletną tablicą zależności
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
  }, [token, navigate, fetchAppointments]);

  const nextAppointment = appointments
    .slice()
    .sort((a, b) => new Date(a.time) - new Date(b.time))[0];

  if (!user) return <p>Ładowanie...</p>;

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />
      <Sidebar />
      <div className="ml-40 pt-[65px] flex flex-col items-center">
        <Card className="bg-black/70 text-white w-full max-w-4xl mt-4">
          <CardHeader>
            <CardTitle>Witaj {user.firstName}</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">
              Najbliższa zaplanowana wizyta
            </h3>
            {nextAppointment ? (
              <p className="mb-4">
                {nextAppointment.doctorName} ({nextAppointment.specialty}) –{" "}
                {new Date(nextAppointment.time).toLocaleString()}
              </p>
            ) : (
              <p className="mb-4">Brak zaplanowanych wizyt.</p>
            )}
            <h3 className="text-xl font-semibold mb-2">
              Status ostatnich wyników
            </h3>
            <p className="mb-4">Brak nowych wyników badań.</p>

            {user.notifications && user.notifications.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Powiadomienia</h3>
                <ul>
                  {user.notifications.map((n) => (
                    <li key={n._id}>{n.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button onClick={() => navigate("/calendar")}>Umów wizytę</Button>
            <Button onClick={() => navigate("/visits")}>Historia wizyt</Button>
            <Button onClick={() => navigate("/messages")}>Wiadomości</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
