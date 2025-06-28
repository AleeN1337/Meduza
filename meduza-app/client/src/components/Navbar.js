import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-black/60 text-white relative h-[65px] z-10 w-full">
      <div className="flex-shrink-0">
        <Link to="/">
          <img
            src="/Logo_MEDuza.png"
            alt="MEDuza logo"
            className="h-12 cursor-pointer transition-transform hover:scale-110"
          />
        </Link>
      </div>

      <nav className="hidden md:flex gap-6 ml-auto">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="text-white font-bold">
              Panel
            </Link>
            <Link
              to="/"
              className="text-white font-bold"
              onClick={() => localStorage.removeItem("token")}
            >
              Wyloguj
            </Link>
          </>
        ) : (
          <>
            <Link to="/register" className="text-white font-bold">
              Rejestracja
            </Link>
            <Link to="/login" className="text-white font-bold">
              Logowanie
            </Link>
          </>
        )}
      </nav>

      <button
        className="text-2xl ml-auto md:hidden focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <div
        className={`md:hidden fixed top-[65px] right-0 w-40 bg-black/80 p-4 flex flex-col gap-4 transition-transform z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="text-white font-bold"
              onClick={() => setMenuOpen(false)}
            >
              Zaloguj
            </Link>
            <Link
              to="/"
              className="text-white font-bold"
              onClick={() => {
                localStorage.removeItem("token");
                setMenuOpen(false);
              }}
            >
              Wyloguj
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className="text-white font-bold"
              onClick={() => setMenuOpen(false)}
            >
              Rejestracja
            </Link>
            <Link
              to="/login"
              className="text-white font-bold"
              onClick={() => setMenuOpen(false)}
            >
              Logowanie
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
