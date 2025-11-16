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
import './App.css';

function App() {
    const { token, userRole, userId, login, logout } = useAuth();

    return (
        <Router>
            <div className="app">
                {token && <Navbar userRole={userRole} onLogout={logout} />}

                {token ? (
                    <PageWrapper>
                        <Routes>
                            <Route path="/" element={<Navigate to={`/${userRole}`} replace />} />

                            {/* Admin routes */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute role={userRole} allowedRoles={['admin']}>
                                        <AdminPage token={token} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Doctor routes */}
                            <Route
                                path="/doctor"
                                element={
                                    <ProtectedRoute role={userRole} allowedRoles={['doctor']}>
                                        <DoctorPage token={token} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Staff routes */}
                            <Route
                                path="/staff"
                                element={
                                    <ProtectedRoute role={userRole} allowedRoles={['staff']}>
                                        <StaffPage token={token} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Patient Management - tillgänglig för staff, doctor och admin */}
                            <Route
                                path="/patients"
                                element={
                                    <ProtectedRoute role={userRole} allowedRoles={['staff', 'doctor', 'admin']}>
                                        <PatientManagementPage token={token} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Patient routes */}
                            <Route
                                path="/patient"
                                element={
                                    <ProtectedRoute role={userRole} allowedRoles={['patient']}>
                                        <PatientPage token={token} userId={userId} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Messages - tillgänglig för alla */}
                            <Route
                                path="/messages"
                                element={
                                    <ProtectedRoute role={userRole} allowedRoles={['patient', 'doctor', 'staff', 'admin']}>
                                        <MessagesPage token={token} role={userRole} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
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
