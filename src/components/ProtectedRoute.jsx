// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role, allowedRoles }) {
    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;
