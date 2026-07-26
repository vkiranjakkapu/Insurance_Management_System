import { Navigate, Outlet } from "react-router-dom";
import usePrincipal from "../context/usePrincipal";

export default function ProtectedRoute() {
    const { principal } = usePrincipal();

    if (!principal.isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
