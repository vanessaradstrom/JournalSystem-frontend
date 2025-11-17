// src/App.js - Förenklad version
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PageWrapper from './components/PageWrapper';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';
import StaffPage from './pages/StaffPage';
import PatientPage from './pages/PatientPage';
import MessagesPage from './pages/MessagesPage';
import PatientManagementPage from './pages/PatientManagementPage';
import './styles/global.css';

// Route configuration för bättre underhåll
const routeConfig = {
    admin: { component: AdminPage, allowedRoles: ['admin'] },
    doctor: { component: DoctorPage, allowedRoles: ['doctor'] },
    staff: { component: StaffPage, allowedRoles: ['staff'] },
    patient: { component: PatientPage, allowedRoles: ['patient'] },
    messages: { component: MessagesPage, allowedRoles: ['patient', 'doctor', 'staff', 'admin'] },
    patients: { component: PatientManagementPage, allowedRoles: ['staff', 'doctor', 'admin'] }
};

function App() {
    const { token, userRole, userId, login, logout } = useAuth();

    const renderProtectedRoute = (path, config) => (
        <Route
            key={path}
            path={path}
            element={
                <ProtectedRoute allowedRoles={config.allowedRoles}>
                    <config.component
                        token={token}
                        userId={userId}
                        role={userRole}
                    />
                </ProtectedRoute>
            }
        />
    );

    return (
        <Router>
            <div className="app">
                {token && <Navbar userRole={userRole} onLogout={logout} />}

                {token ? (
                    <PageWrapper>
                        <Routes>
                            <Route path="/" element={<Navigate to={`/${userRole}`} replace />} />

                            {/* Dynamiskt genererade routes */}
                            {Object.entries(routeConfig).map(([path, config]) =>
                                renderProtectedRoute(`/${path}`, config)
                            )}

                            {/* Catch-all route */}
                            <Route path="*" element={<Navigate to={`/${userRole}`} replace />} />
                        </Routes>
                    </PageWrapper>
                ) : (
                    <Routes>
                        <Route path="/login" element={<LoginPage onLogin={login} />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;