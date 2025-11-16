import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role, allowedRoles }) {
    if (!role || !allowedRoles || !allowedRoles.includes(role)) {
        return <Navigate to={role ? `/${role}` : '/login'} replace />;
    }

    return children;
}

export default ProtectedRoute;
