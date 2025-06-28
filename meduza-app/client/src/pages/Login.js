import React, { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      setMsg(`Witaj, ${res.data.user.firstName}!`);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Błąd logowania");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
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
        <button
          type="submit"
          className="bg-primary hover:bg-primary-light p-3 rounded font-bold"
        >
          Zaloguj się
        </button>
      </form>

      {msg && <p className="mt-4 text-white">{msg}</p>}

      <footer className="w-full text-center py-2 bg-black/50 text-white mt-4">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default Login;
