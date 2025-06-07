import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="top-bar">
      <div className="logo">
        {isLoggedIn ? (
          <img src="/Logo_MEDuza.png" alt="MEDuza logo" style={{ height: "60px" }} />
        ) : (
          <Link to="/">
            <img
              src="/Logo_MEDuza.png"
              alt="MEDuza logo"
              style={{ height: "60px", cursor: "pointer" }}
            />
          </Link>
        )}
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        {!isLoggedIn && (
          <>
            <Link to="/register">Rejestracja</Link>
            <Link to="/login">Logowanie</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
