import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DoctorChangePassword = () => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("doctorToken");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/doctor-auth/change-password",
        form,
        {
          headers: { Authorization: token },
        }
      );
      setMsg("Hasło zmienione");
      navigate("/doctor-dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Błąd zmiany hasła");
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
          name="oldPassword"
          type="password"
          placeholder="Stare hasło"
          onChange={handleChange}
          required
          className="p-3 rounded text-black"
        />
        <input
          name="newPassword"
          type="password"
          placeholder="Nowe hasło"
          onChange={handleChange}
          required
          className="p-3 rounded text-black"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-light p-3 rounded font-bold"
        >
          Zmień hasło
        </button>
      </form>
      {msg && <p className="mt-4 text-white">{msg}</p>}
      <footer className="w-full text-center text-white py-2 bg-black/50 text-sm mt-auto">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default DoctorChangePassword;
