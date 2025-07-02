import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const mockPrescriptions = [
  { id: 1, date: "2025-01-15", doctor: "dr Kowalski", code: "ABCD-1234" },
];

const Prescriptions = () => (
  <div
    className="min-h-screen bg-cover bg-center text-white"
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
    }}
  >
    <Navbar />
    <Sidebar />
    <div className="ml-40 pt-[65px] flex flex-col items-center">
      <div className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Recepty i zalecenia</h2>
        <ul className="space-y-2">
          {mockPrescriptions.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center border-b border-white/20 pb-2"
            >
              <span>
                {p.date} - {p.doctor} - {p.code}
              </span>
              <button className="bg-green-600 px-2 py-1 rounded">
                Pobierz
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default Prescriptions;
