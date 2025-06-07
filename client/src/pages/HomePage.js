import React, { useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home-page">
     
      <div
        className="background"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + '/meduza-bg.png'})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: -1,
          opacity: 1,
        }}
      ></div>

      <div className="top-bar">
        <div className="logo">
           <img src="/Logo_MEDuza.png" alt="MEDuza logo" style={{ height: "90px" }} />
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/register">Rejestracja</Link>
        <Link to="/login">Logowanie</Link>
      </div>

          <div className="main-content">
        <h2>Witamy w MEDuza</h2>
        <p>Zarządzaj zdrowiem w nowoczesny sposób.</p>
       
      </div>

      
      <footer className="footer">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default HomePage;
