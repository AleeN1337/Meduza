import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: token },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (!user) return <p>Ładowanie...</p>;

  return (
    <div>
      <h2>Witaj {user.firstName}</h2>
      <p>To jest chroniona strona.</p>
    </div>
  );
};

export default Dashboard;
