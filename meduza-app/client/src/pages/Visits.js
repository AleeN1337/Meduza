import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Dialog from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import Sidebar from "../components/Sidebar";

const Visits = () => {
  const [appointments, setAppointments] = useState([]);
  const [cancelInfo, setCancelInfo] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, []); // eslint-disable-line

  const fetchAppointments = () => {
    axios
      .get("http://localhost:5000/api/doctors/my", {
        headers: { Authorization: token },
      })
      .then((res) => {
        const fetched = Array.isArray(res.data) ? res.data : [];
        setAppointments(fetched);
      })
      .catch((err) => console.error("Błąd pobierania wizyt:", err));
  };

  const cancelVisit = (doctorId, slotId) => {
    axios
      .post(
        `http://localhost:5000/api/doctors/${doctorId}/cancel`,
        { slotId },
        { headers: { Authorization: token } }
      )
      .then(fetchAppointments)
      .catch((err) => console.error("Błąd anulowania:", err));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/meduza-bg.png"})`,
      }}
    >
      <Navbar />
      <Sidebar />
      <div className="ml-40 pt-[65px] flex flex-col items-center"></div>
      <Card className="bg-black/70 text-white w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Moje wizyty</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="mb-6 space-y-2">
            {appointments.length ? (
              appointments.map((ap) => (
                <li
                  key={ap.slotId}
                  className="flex items-center justify-between"
                >
                  <span>
                    {ap.doctorName} ({ap.specialty}) -{" "}
                    {new Date(ap.time).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setCancelInfo({
                          doctorId: ap.doctorId,
                          slotId: ap.slotId,
                        })
                      }
                      className="bg-red-600 text-white"
                    >
                      Anuluj
                    </Button>
                    <Button onClick={() => navigate("/calendar")}>
                      Przełóż
                    </Button>
                    <Button className="bg-green-600 text-white">PDF</Button>
                  </div>
                </li>
              ))
            ) : (
              <p>Brak wizyt.</p>
            )}
          </ul>
        </CardContent>
        <CardFooter />
      </Card>
      {cancelInfo && (
        <Dialog
          open={!!cancelInfo}
          onClose={() => setCancelInfo(null)}
          title="Potwierdzenie"
        >
          <p>Czy na pewno chcesz anulować wizytę?</p>
          <div className="mt-4 flex gap-2 justify-end">
            <Button
              onClick={() => {
                cancelVisit(cancelInfo.doctorId, cancelInfo.slotId);
                setCancelInfo(null);
              }}
            >
              Tak
            </Button>
            <Button variant="outline" onClick={() => setCancelInfo(null)}>
              Nie
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Visits;
