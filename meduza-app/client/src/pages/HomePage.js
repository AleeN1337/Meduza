import React from "react";
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

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center text-white">
      {/* Tło */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
        }}
      />
      <Navbar />

      {/* Główna treść */}

      <div className="text-center pt-24 px-4 z-10">
        <h2 className="text-4xl md:text-5xl font-bold drop-shadow mb-4">
          Witamy w <span className="text-meddark">MED</span>
          <span className="text-medgreen">uza</span>
        </h2>

        <p className="text-lg md:text-xl mb-8">
          Zarządzaj zdrowiem w nowoczesny sposób.
        </p>

        {/* Sekcja opinii */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-2xl mb-6">
            Opinie naszych użytkowników
          </h3>
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
      </div>

      {/* Stopka */}

      <footer className="w-full text-center py-2 bg-black/50 text-sm mt-auto">
        © 2025 MEDuza. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
};

export default HomePage;
