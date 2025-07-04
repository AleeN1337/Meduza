import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const mockHistory = [
  {
    id: 1,
    date: "2025-01-15 10:00",
    doctor: "dr Kowalski",
    notes: "Kontrola ogólna, wyniki w normie.",
    prescription: "Ibuprom 200mg",
  },
];

const History = () => (
  <div
    className="min-h-screen bg-cover bg-center text-white"
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL + "/background.png"})`,
    }}
  >
    <Navbar />
    <Sidebar />
    <div className="ml-40 pt-[65px] flex flex-col items-center">
      <div className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Historia leczenia</h2>
        <ul className="space-y-2">
          {mockHistory.map((h) => (
            <li key={h.id} className="border-b border-white/20 pb-2">
              <p>
                {h.date} - {h.doctor}
              </p>
              <p className="text-sm">{h.notes}</p>
              <p className="text-sm italic">{h.prescription}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default History;
