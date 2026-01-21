import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
    const { user, loading, isAuthenticated } = useContext(AuthContext);

    if (loading) return <div className="p-4">Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their dashboard or unauthorized page
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
        return <Navigate to="/student" replace />; // Default fallback
    }

    return <Outlet />;
};

export default PrivateRoute;
