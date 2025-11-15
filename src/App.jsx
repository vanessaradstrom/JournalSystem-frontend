// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import PatientPage from "./pages/PatientPage";
import DoctorPage from "./pages/DoctorPage";
import StaffPage from "./pages/StaffPage";
import AdminPage from "./pages/AdminPage";
import MessagesPage from "./pages/MessagesPage";
import PatientManagementPage from "./pages/PatientManagementPage";
import "./App.css";

function AppInner() {
    const location = useLocation();
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("userRole");
        const storedUserId = localStorage.getItem("userId");
        if (storedToken && storedRole) {
            setToken(storedToken);
            setUserRole(storedRole); // lowercase
            setUserId(storedUserId);
        }
    }, []);

    const handleLogin = (userData) => {
        const normalizedRole = userData.role.toLowerCase();
        setToken(userData.token);
        setUserRole(normalizedRole);
        setUserId(userData.userId);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("userRole", normalizedRole);
        localStorage.setItem("userId", userData.userId);
    };

    const handleLogout = () => {
        setToken(null);
        setUserRole(null);
        setUserId(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
    };

    const showNavbar = userRole && location.pathname !== "/";

    return (
        <>
            {showNavbar && <Navbar role={userRole} onLogout={handleLogout} />}
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                    <Route
                        path="/doctor"
                        element={
                            <ProtectedRoute role={userRole} allowedRoles={["doctor", "admin"]}>
                                <DoctorPage token={token} userId={userId} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patient"
                        element={
                            <ProtectedRoute role={userRole} allowedRoles={["patient"]}>
                                <PatientPage token={token} userId={userId} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/staff"
                        element={
                            <ProtectedRoute role={userRole} allowedRoles={["staff", "admin"]}>
                                <StaffPage token={token} userId={userId} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role={userRole} allowedRoles={["admin"]}>
                                <AdminPage token={token} userId={userId} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute
                                role={userRole}
                                allowedRoles={["patient", "doctor", "staff", "admin"]}
                            >
                                <MessagesPage token={token} userId={userId} role={userRole} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patients"
                        element={
                            <ProtectedRoute
                                role={userRole}
                                allowedRoles={["doctor", "staff", "admin"]}
                            >
                                <PatientManagementPage token={token} userId={userId} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppInner />
        </BrowserRouter>
    );
}
