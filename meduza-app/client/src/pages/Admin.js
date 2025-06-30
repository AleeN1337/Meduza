import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [doctors, setDoctors] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    specialty: "",
    pwz: "",
  });
  const [msg, setMsg] = useState("");

  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/doctors/admin", {
        headers: { Authorization: token },
      })
      .then((res) => setDoctors(res.data))
      .catch(() => setDoctors([]));
  }, [token]);

  const handleDoctorChange = (e) =>
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginForm
      );
      if (res.data.user.role !== "admin") {
        setMsg("Brak uprawnień");
        return;
      }
      localStorage.setItem("adminToken", res.data.token);
      setToken(res.data.token);
      setMsg("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Błąd logowania");
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/doctors",
        doctorForm,
        { headers: { Authorization: token } }
      );
      setMsg(
        `Dodano lekarza. Login: ${res.data.username} Hasło: ${res.data.password}`
      );
      setDoctorForm({ name: "", email: "", specialty: "", pwz: "" });
      const list = await axios.get("http://localhost:5000/api/doctors/admin", {
        headers: { Authorization: token },
      });
      setDoctors(list.data);
    } catch (err) {
      setMsg(err.response?.data?.message || "Błąd dodawania lekarza");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    navigate("/");
  };

  if (!token) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center pt-[65px]"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
        }}
      >
        <Navbar />
        <form
          onSubmit={handleLogin}
          className="bg-black/70 p-8 rounded-xl shadow-lg text-white flex flex-col gap-4 max-w-md w-full"
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleLoginChange}
            required
            className="p-3 rounded text-black"
          />
          <input
            name="password"
            type="password"
            placeholder="Hasło"
            onChange={handleLoginChange}
            required
            className="p-3 rounded text-black"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-light p-3 rounded font-bold"
          >
            Zaloguj jako admin
          </button>
        </form>
        {msg && <p className="mt-4 text-white">{msg}</p>}
        <footer className="w-full text-center text-white py-2 bg-black/50 text-sm mt-auto">
          © 2025 MEDuza. Wszystkie prawa zastrzeżone.
        </footer>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center pt-[65px] text-white"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />
      <div className="bg-black/70 p-6 rounded-xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Panel administratora</h2>
        <form onSubmit={handleAddDoctor} className="space-y-4 text-black">
          <input
            type="text"
            name="name"
            placeholder="Imię i nazwisko"
            value={doctorForm.name}
            onChange={handleDoctorChange}
            required
            className="p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={doctorForm.email}
            onChange={handleDoctorChange}
            className="p-2 rounded w-full"
          />
          <input
            type="text"
            name="specialty"
            placeholder="Specjalizacja"
            value={doctorForm.specialty}
            onChange={handleDoctorChange}
            className="p-2 rounded w-full"
          />
          <input
            type="text"
            name="pwz"
            placeholder="Numer PWZ"
            value={doctorForm.pwz}
            onChange={handleDoctorChange}
            className="p-2 rounded w-full"
          />

          <button
            type="submit"
            className="bg-primary hover:bg-primary-light p-3 rounded font-bold text-white"
          >
            Dodaj lekarza
          </button>
        </form>
        <h3 className="text-xl font-semibold mt-4">Lista lekarzy</h3>
        <ul className="mb-4">
          {doctors.map((d) => (
            <li key={d._id} className="text-sm">
              {d.name} ({d.username}) - pierwsze hasło: {d.tempPassword || "-"}
            </li>
          ))}
        </ul>
        <button
          onClick={logout}
          className="mt-4 bg-red-600 px-4 py-2 rounded text-white"
        >
          Wyloguj
        </button>
        {msg && <p className="mt-4">{msg}</p>}
      </div>
    </div>
  );
};

export default Admin;
