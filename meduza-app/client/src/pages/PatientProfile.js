import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PatientProfile = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    city: "",
  });
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me", {
        headers: { Authorization: token },
      })
      .then((res) => setForm(res.data.user))
      .catch(() => setMsg("Błąd pobierania danych"));
  }, []); // eslint-disable-line

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/users/me", form, {
        headers: { Authorization: token },
      });
      setForm(res.data.user);
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
      <Sidebar />
      <div className="ml-40 pt-[65px] flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-4xl flex flex-col gap-2"
        >
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Imię"
            className="p-2 rounded text-black"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Nazwisko"
            className="p-2 rounded text-black"
          />
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            placeholder="Telefon"
            className="p-2 rounded text-black"
          />
          <input
            name="country"
            value={form.country || ""}
            onChange={handleChange}
            placeholder="Kraj"
            className="p-2 rounded text-black"
          />
          <input
            name="city"
            value={form.city || ""}
            onChange={handleChange}
            placeholder="Miasto"
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

export default PatientProfile;
