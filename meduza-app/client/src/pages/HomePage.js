import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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

const features = [
  {
    icon: "\ud83d\udcc5",
    title: "Prosta rejestracja",
    text: "Zarezerwuj termin wizyty w kilka klikni\u0119\u0107.",
  },
  {
    icon: "\ud83d\udcf1",
    title: "Dost\u0119p mobilny",
    text: "Korzystaj z aplikacji na ka\u017cdym urz\u0105dzeniu.",
  },
  {
    icon: "\ud83d\udd12",
    title: "Bezpiecze\u0144stwo danych",
    text: "Twoje dane s\u0105 szyfrowane i bezpieczne.",
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
    <div className="flex flex-col min-h-screen text-white">
      <Navbar />
      <header
        className="relative flex flex-col items-center justify-center bg-cover bg-center pt-[65px]"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
        }}
      >
        <div className="w-full text-center backdrop-brightness-50 py-24 px-4">
          <img
            src="/Logo_MEDuza.png"
            alt="MEDuza logo"
            className="h-40 w-auto mx-auto mb-6 drop-shadow-xl"
          />
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Nowoczesny system zarządzania wizytami medycznymi
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="bg-primary hover:bg-primary-light px-6 py-3 rounded-lg font-bold"
            >
              Logowanie pacjenta
            </Link>
            <Link
              to="/doctor-login"
              className="bg-primary hover:bg-primary-light px-6 py-3 rounded-lg font-bold"
            >
              Logowanie lekarza
            </Link>
            <Link
              to="/admin"
              className="bg-primary hover:bg-primary-light px-6 py-3 rounded-lg font-bold  "
            >
              Logowanie admina
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 bg-white text-black">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Dlaczego MEDuza?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="text-5xl">{f.icon}</div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="text-gray-700">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Opinie użytkowników
          </h2>
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
      </section>
      <footer className="py-4 bg-black text-center text-sm mt-auto">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default HomePage;
