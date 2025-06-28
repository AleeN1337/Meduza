import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
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

    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios
      .get("http://localhost:5000/api/doctors", {
        headers: { Authorization: token },
      })
      .then((res) => setDoctors(res.data.doctors))
      .catch((err) => console.error(err));
  };

  const handleBook = (doctorId, slotId) => {
    axios
      .post(
        `http://localhost:5000/api/doctors/${doctorId}/book`,
        { slotId },
        { headers: { Authorization: token } }
      )
      .then(fetchDoctors)
      .catch((err) => console.error(err));
  };

  const handleCancel = (doctorId, slotId) => {
    axios
      .post(
        `http://localhost:5000/api/doctors/${doctorId}/cancel`,
        { slotId },
        { headers: { Authorization: token } }
      )
      .then(fetchDoctors)
      .catch((err) => console.error(err));
  };

  if (!user) return <p>Ładowanie...</p>;

  const myAppointments = [];
  doctors.forEach((doc) => {
    if (Array.isArray(doc.slots)) {
      doc.slots.forEach((slot) => {
        if (slot.patient === user._id) {
          myAppointments.push({
            doctorId: doc._id,
            slotId: slot._id,
            doctor: doc.name,
            time: slot.time,
          });
        }
      });
    }
  });

  return (
    <div className="pt-20 text-black px-4">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">Witaj {user.firstName}</h2>

      <h3 className="text-xl font-semibold mb-2">Twoje rezerwacje</h3>
      <ul className="mb-6 space-y-2">
        {myAppointments.length ? (
          myAppointments.map((ap) => (
            <li key={ap.slotId}>
              {ap.doctor} - {new Date(ap.time).toLocaleString()}
              <button
                onClick={() => handleCancel(ap.doctorId, ap.slotId)}
                className="ml-2 bg-blue-600 text-white px-2 py-1 rounded"
              >
                Anuluj
              </button>
            </li>
          ))
        ) : (
          <p>Brak rezerwacji.</p>
        )}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Dostępni lekarze</h3>
      {doctors.map((doc) => (
        <div key={doc._id} className="mb-5">
          <h4 className="font-semibold">
            {doc.specialty} {doc.name}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {Array.isArray(doc.slots) &&
              doc.slots.map((slot) => (
                <div
                  key={slot._id}
                  className={`p-2 rounded text-sm ${
                    slot.booked ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  {new Date(slot.time).toLocaleString()}
                  {!slot.booked ? (
                    <button
                      onClick={() => handleBook(doc._id, slot._id)}
                      className="ml-2 bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Rezerwuj
                    </button>
                  ) : slot.patient === user._id ? (
                    <button
                      onClick={() => handleCancel(doc._id, slot._id)}
                      className="ml-2 bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Anuluj
                    </button>
                  ) : (
                    <span className="ml-2 text-gray-600">Zajęte</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
