import { Link } from "react-router-dom";

function Navbar({ role }) {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/" style={{ margin: "0 10px" }}>Home</Link>
      {role === "doctor" && <Link to="/doctor" style={{ margin: "0 10px" }}>Doctor Page</Link>}
      {role === "patient" && <Link to="/patient" style={{ margin: "0 10px" }}>Patient Page</Link>}
      {role === "staff" && <Link to="/staff" style={{ margin: "0 10px" }}>Staff Page</Link>}
    </nav>
  );
}

export default Navbar;
