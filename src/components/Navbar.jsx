// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ userRole, onLogout }) {
    if (!userRole) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Journal System</Link>
            </div>

            <div className="navbar-links">
                {(userRole === 'doctor' || userRole === 'admin') && (
                    <Link to="/doctor" className="nav-link">
                        Doctor Dashboard
                    </Link>
                )}

                {userRole === 'patient' && (
                    <Link to="/patient" className="nav-link">
                        My Health
                    </Link>
                )}

                {userRole === 'staff' && (
                    <Link to="/staff" className="nav-link">
                        Staff Dashboard
                    </Link>
                )}

                {(userRole === 'doctor' || userRole === 'staff' || userRole === 'admin') && (
                    <Link to="/patients" className="nav-link">
                        Patient Management
                    </Link>
                )}

                {userRole === 'admin' && (
                    <Link to="/admin" className="nav-link">
                        Admin Panel
                    </Link>
                )}

                <Link to="/messages" className="nav-link">
                    Messages
                </Link>

                <button onClick={onLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
