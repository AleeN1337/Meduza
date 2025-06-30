import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorChangePassword from "./pages/DoctorChangePassword";
import Calendar from "./pages/Calendar";
import Visits from "./pages/Visits";
import History from "./pages/History";
import Prescriptions from "./pages/Prescriptions";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import PatientProfile from "./pages/PatientProfile";
import DoctorProfile from "./pages/DoctorProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route
          path="/doctor-change-password"
          element={<DoctorChangePassword />}
        />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/history" element={<History />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
