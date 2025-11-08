import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import PatientPage from "./pages/PatientPage";
import DoctorPage from "./pages/DoctorPage";
import StaffPage from "./pages/StaffPage";

function App() {
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));

    return (
        <BrowserRouter>
            {userRole && <Navbar role={userRole} />}
            <Routes>
                <Route path="/" element={<LoginPage setUserRole={setUserRole} setToken={setToken} />} />
                <Route
                    path="/doctor"
                    element={
                        <ProtectedRoute role={userRole} allowedRoles={["doctor"]}>
                            <DoctorPage token={token} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute role={userRole} allowedRoles={["patient"]}>
                            <PatientPage token={token} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute role={userRole} allowedRoles={["staff"]}>
                            <StaffPage token={token} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
