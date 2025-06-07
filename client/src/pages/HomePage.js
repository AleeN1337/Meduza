import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "./HomePage.css";

const testimonials = [
  { name: "Anna K.", text: "Świetna aplikacja! Wszystko działa sprawnie i szybko." },
  { name: "Marek Z.", text: "Rewelacyjny system rejestracji wizyt, bardzo intuicyjny!" },
  { name: "Karolina M.", text: "Design i funkcjonalność na najwyższym poziomie." },
  { name: "Tomasz B.", text: "W końcu aplikacja, której można zaufać w kwestii zdrowia." },
];

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 1000,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 3,
  slidesToScroll: 1,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        arrows: false, 
        dots: true,
      },
    },
  ],
};

  return (
    <div className="home-page">
      {/* Tło */}
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

      {/* Pasek górny */}
      <div className="top-bar">
        <div className="logo">
          {isLoggedIn ? (
            <img src="/Logo_MEDuza.png" alt="MEDuza logo" style={{ height: "70px" }} />
          ) : (
            <Link to="/">
              <img
                src="/Logo_MEDuza.png"
                alt="MEDuza logo"
                style={{ height: "70px", cursor: "pointer" }}
              />
            </Link>
          )}
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Menu boczne */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/register">Rejestracja</Link>
        <Link to="/login">Logowanie</Link>
      </div>

      {/* Główna treść */}
      <div className="main-content">
        <h2>
  Witamy w <span className="med-logo">MED</span><span className="uza-logo">uza</span>
</h2>

        <p>Zarządzaj zdrowiem w nowoczesny sposób.</p>

        {/* Slider z opiniami */}
        <div className="testimonial-container">
          <h3 className="testimonial-title">Opinie naszych użytkowników</h3>
          <Slider {...sliderSettings}>
            {testimonials.map((op, index) => (
              <div className="testimonial-card" key={index}>
                <p className="testimonial-text">“{op.text}”</p>
                <p className="testimonial-author">— {op.name}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Stopka */}
      <footer className="footer">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default HomePage;
