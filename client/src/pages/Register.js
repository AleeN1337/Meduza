import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
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
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Błąd rejestracji");
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
        <input name="firstName" placeholder="Imię" onChange={handleChange} required />
        <input name="lastName" placeholder="Nazwisko" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Hasło" onChange={handleChange} required />
        <input name="phone" placeholder="Telefon" onChange={handleChange} required />
        <input name="address" placeholder="Adres zamieszkania" onChange={handleChange} required />
        <select name="country" onChange={handleChange} required>
          <option value="Polska">Polska</option>
          <option value="Inny">Inny</option>
        </select>
        <button type="submit">Zarejestruj się</button>
      </form>

      {msg && <p>{msg}</p>}

      <footer className="footer">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default Register;
