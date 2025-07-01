import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isDoctor }) => {
  const links = isDoctor
    ? [
        { to: "/doctor-dashboard", label: "Panel" },
        { to: "/doctor-profile", label: "Profil" },
      ]
    : [
        { to: "/dashboard", label: "Panel" },
        { to: "/profile", label: "Profil" },
        { to: "/calendar", label: "Kalendarz" },
        { to: "/visits", label: "Wizyty" },
      ];

  return (
    <div className="bg-black/80 text-white w-40 fixed top-[65px] bottom-0 left-0 p-4 flex flex-col gap-4">
      {links.map((l) => (
        <Link key={l.to} to={l.to} className="hover:underline">
          {l.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
