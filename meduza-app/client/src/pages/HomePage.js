import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const testimonials = [
  {
    name: "Anna K.",
    text: "Świetna aplikacja! Wszystko działa sprawnie i szybko.",
  },
  {
    name: "Marek Z.",
    text: "Rewelacyjny system rejestracji wizyt, bardzo intuicyjny!",
  },
  {
    name: "Karolina M.",
    text: "Design i funkcjonalność na najwyższym poziomie.",
  },
  {
    name: "Tomasz B.",
    text: "W końcu aplikacja, której można zaufać w kwestii zdrowia.",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white">
      {/* Tło */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
        }}
      />
      {/* Logo */}
      <img
        src="/Logo_MEDuza.png"
        alt="MEDuza logo"
        className="h-40 w-auto mb-8 drop-shadow-xl"
      />

      {/* Przyciski */}
      <div className="flex gap-4 mb-12">
        <Link
          to="/login"
          className="bg-primary hover:bg-primary-light px-6 py-3 rounded font-bold"
        >
          Logowanie
        </Link>
        <Link
          to="/register"
          className="bg-primary hover:bg-primary-light px-6 py-3 rounded font-bold"
        >
          Rejestracja
        </Link>
      </div>
      {/* Sekcja opinii */}
      <div className="max-w-4xl mx-auto w-full px-4 ">
        <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory">
          {testimonials.map((op, index) => (
            <div
              className="bg-white/10 rounded-xl p-6 backdrop-blur-md shadow-lg flex flex-col justify-between min-h-[180px] flex-shrink-0 w-72 snap-center"
              key={index}
            >
              <p className="italic mb-2">“{op.text}”</p>
              <p className="text-right font-semibold">— {op.name}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Stopka */}
      <footer className="w-full text-center py-2 bg-black/50 text-sm mt-auto">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default HomePage;
