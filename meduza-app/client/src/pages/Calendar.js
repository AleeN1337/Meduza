import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Calendar = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios
      .get("http://localhost:5000/api/doctors", {
        headers: { Authorization: token },
      })
      .then((res) => {
        const fetched = Array.isArray(res.data) ? res.data : [];
        setDoctors(fetched);
      })
      .catch((err) => console.error("Błąd pobierania lekarzy:", err));
  };

  const handleBook = (doctorId, slotId) => {
    axios
      .post(
        `http://localhost:5000/api/doctors/${doctorId}/book`,
        { slotId },
        { headers: { Authorization: token } }
      )
      .then(fetchDoctors)
      .catch((err) => console.error("Błąd rezerwacji:", err));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center pt-[65px] text-black"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />
      <div className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Wybierz termin wizyty</h2>
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
                    ) : (
                      <span className="ml-2 text-gray-300">Zajęte</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
