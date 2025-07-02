import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DoctorProfile = () => {
  const [form, setForm] = useState({ email: "", specialty: "", pwz: "" });
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/doctor-dashboard", {
        headers: { Authorization: token },
      })
      .then((res) => {
        const { email, specialty, pwz } = res.data.doctor;
        setForm({
          email: email || "",
          specialty: specialty || "",
          pwz: pwz || "",
        });
      })
      .catch(() => setMsg("Błąd pobierania danych"));
  }, []); // eslint-disable-line

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/doctors/me",
        form,
        { headers: { Authorization: token } }
      );
      setForm(res.data.doctor);
      setMsg("Zapisano zmiany");
    } catch {
      setMsg("Błąd zapisu");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />
      <Sidebar isDoctor />
      <div className="ml-40 pt-[65px] flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-4xl flex flex-col gap-2"
        >
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 rounded text-black"
          />
          <input
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            placeholder="Specjalizacja"
            className="p-2 rounded text-black"
          />
          <input
            name="pwz"
            value={form.pwz}
            onChange={handleChange}
            placeholder="Numer PWZ"
            className="p-2 rounded text-black"
          />
          <button type="submit" className="bg-primary px-4 py-2 rounded">
            Zapisz
          </button>
        </form>
        {msg && <p className="mt-4">{msg}</p>}
      </div>
    </div>
  );
};

export default DoctorProfile;
