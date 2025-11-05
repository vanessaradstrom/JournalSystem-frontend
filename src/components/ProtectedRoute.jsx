import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role, allowedRoles }) {
  if (!allowedRoles.includes(role)) {
    // Om användaren inte har tillåtelse skickas den tillbaka till login
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
