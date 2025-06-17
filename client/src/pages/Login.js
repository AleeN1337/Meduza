import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // ⬅️ Dodano import Navbar

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setMsg(`Witaj, ${res.data.user.firstName}!`);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Błąd logowania");
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar /> 
      
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Hasło"
          onChange={handleChange}
          required
        />
        <button type="submit">Zaloguj się</button>
      </form>

      {msg && <p>{msg}</p>}

      <footer className="footer">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default Login;
