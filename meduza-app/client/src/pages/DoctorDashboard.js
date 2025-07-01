import React, { useEffect, useState } from "react";
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
import { DateTimePicker } from "../components/ui/datetime-picker";

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
  }, [navigate, token]);

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

  const rejectVisit = async (slotId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/doctors/${doctor._id}/reject`,
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

  const updateSlot = async (slotId, data) => {
    await axios.put(
      `http://localhost:5000/api/doctors/me/slots/${slotId}`,
      data,
      { headers: { Authorization: token } }
    );
    const res = await axios.get("http://localhost:5000/api/doctor-dashboard", {
      headers: { Authorization: token },
    });
    setDoctor(res.data.doctor);
  };

  const deleteSlot = async (slotId) => {
    await axios.delete(`http://localhost:5000/api/doctors/me/slots/${slotId}`, {
      headers: { Authorization: token },
    });
    const res = await axios.get("http://localhost:5000/api/doctor-dashboard", {
      headers: { Authorization: token },
    });
    setDoctor(res.data.doctor);
  };

  const addSlot = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const time = formData.get("time");
    const location = formData.get("location");
    try {
      await axios.post(
        "http://localhost:5000/api/doctors/me/slots",
        { time, location },
        { headers: { Authorization: token } }
      );
      const res = await axios.get(
        "http://localhost:5000/api/doctor-dashboard",
        {
          headers: { Authorization: token },
        }
      );
      setDoctor(res.data.doctor);
      e.target.reset();
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
      <Card className="bg-black/70 text-white w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Witaj dr {doctor.name}</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <Button
                    onClick={() => confirmVisit(slot._id)}
                    className="ml-2"
                  >
                    Akceptuj
                  </Button>
                  <Button
                    onClick={() => rejectVisit(slot._id)}
                    variant="outline"
                    className="ml-2 bg-red-600 text-white border-none"
                  >
                    Odrzuć
                  </Button>
                </li>
              ))}
          </ul>
          <h3 className="text-xl font-semibold mb-2">Wolne terminy</h3>
          <ul className="mb-4">
            {doctor.slots
              .filter((s) => !s.booked)
              .map((slot) => (
                <li key={slot._id} className="mb-2 flex gap-2 items-center">
                  <span>
                    {new Date(slot.time).toLocaleString()} - {slot.location}
                  </span>
                  <Button
                    onClick={() =>
                      updateSlot(slot._id, {
                        time: prompt("Nowy czas", slot.time),
                        location: prompt("Miejsce", slot.location),
                      })
                    }
                    className="bg-blue-600 text-white"
                  >
                    Edytuj
                  </Button>
                  <Button
                    onClick={() => deleteSlot(slot._id)}
                    variant="outline"
                    className="bg-red-600 text-white border-none"
                  >
                    Usuń
                  </Button>
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
          <h3 className="text-xl font-semibold mt-4 mb-2">Dodaj termin</h3>
          <form onSubmit={addSlot} className="flex flex-col gap-2 text-black">
            <DateTimePicker name="time" required className="p-2 rounded" />
            <input
              type="text"
              name="location"
              placeholder="Miejsce"
              className="p-2 rounded"
            />
            <Button type="submit">Dodaj</Button>
          </form>
          {doctor.notifications.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Powiadomienia</h3>
              <ul>
                {doctor.notifications.map((n) => (
                  <li key={n._id}>{n.message}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
};

export default DoctorDashboard;
