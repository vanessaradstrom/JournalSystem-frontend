import { useNavigate } from "react-router-dom";

function LoginPage({ setUserRole }) {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    setUserRole(role);
    if (role === "doctor") navigate("/doctor");
    if (role === "patient") navigate("/patient");
    if (role === "staff") navigate("/staff");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>
      <button onClick={() => handleLogin("doctor")}>Login as Doctor</button>
      <button onClick={() => handleLogin("patient")}>Login as Patient</button>
      <button onClick={() => handleLogin("staff")}>Login as Staff</button>
    </div>
  );
}

export default LoginPage;
