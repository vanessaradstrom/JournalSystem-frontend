import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage({ setUserRole, setToken }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid username or password");
            }

            const data = await response.json();

            // Store token
            localStorage.setItem("token", data.token);

            // Set user role and token in state
            setUserRole(data.role.toLowerCase());
            setToken(data.token);

            // Navigate based on role
            const roleRoute = {
                admin: "/admin",
                doctor: "/doctor",
                patient: "/patient",
                staff: "/staff",
            };

            navigate(roleRoute[data.role.toLowerCase()] || "/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Journal System Login</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="test-credentials">
                    <h3>Test Credentials:</h3>
                    <ul>
                        <li><strong>Admin:</strong> admin / password123</li>
                        <li><strong>Doctor:</strong> dr_smith / password123</li>
                        <li><strong>Patient:</strong> patient_john / password123</li>
                        <li><strong>Staff:</strong> nurse_jane / password123</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
