// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ role, onLogout }) {
    const navigate = useNavigate();

    if (!role) return null;

    const handleLogout = () => {
        onLogout();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">JournalSystem</Link>
            </div>
            <div className="navbar-links">
                {(role === "doctor" || role === "admin") && (
                    <>
                        <Link to="/doctor" className="nav-link">
                            Doctor Dashboard
                        </Link>
                        <Link to="/patients" className="nav-link">
                            Patient Management
                        </Link>
                    </>
                )}

                {role === "patient" && (
                    <Link to="/patient" className="nav-link">
                        My Health
                    </Link>
                )}

                {role === "staff" && (
                    <>
                        <Link to="/staff" className="nav-link">
                            Staff Dashboard
                        </Link>
                        <Link to="/patients" className="nav-link">
                            Patient Management
                        </Link>
                    </>
                )}

                {role === "admin" && (
                    <Link to="/admin" className="nav-link">
                        Admin Panel
                    </Link>
                )}

                <Link to="/messages" className="nav-link">
                    Messages
                </Link>

                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
