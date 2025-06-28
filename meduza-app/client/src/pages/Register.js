import React, { useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar"; // ⬅️ Komponent nawigacji

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    country: "Polska",
    role: "patient",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Błąd rejestracji");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center pt-[65px]"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />

      <form
        onSubmit={handleSubmit}
        className="bg-black/70 p-8 rounded-xl shadow-lg text-white flex flex-col gap-4 max-w-md w-full"
      >
        <input
          name="firstName"
          placeholder="Imię"
          onChange={handleChange}
          required
          className="p-3 rounded text-black"
        />
        <input
          name="lastName"
          placeholder="Nazwisko"
          onChange={handleChange}
          required
          className="p-3 rounded text-black"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="p-3 rounded text-black"
        />
        <input
          name="password"
          type="password"
          placeholder="Hasło"
          onChange={handleChange}
          required
          className="p-3 rounded text-black"
        />
        <input
          name="phone"
          placeholder="Telefon"
          onChange={handleChange}
          required
          className="p-3 rounded text-black"
        />
        <input
          name="address"
          placeholder="Adres zamieszkania"
          onChange={handleChange}
          required
          className="p-3 rounded text-black"
        />
        <select
          name="country"
          onChange={handleChange}
          required
          className="p-3 rounded text-black"
        >
          <option value="Polska">Polska</option>
          <option value="Inny">Inny</option>
        </select>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-light p-3 rounded font-bold"
        >
          Zarejestruj się
        </button>
      </form>

      {msg && <p className="mt-4 text-white">{msg}</p>}

      <footer className="w-full text-center text-white py-2 bg-black/50 text-sm mt-auto">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default Register;
