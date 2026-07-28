import { Navigate, Outlet } from "react-router-dom";
import usePrincipal, { AuthStatus } from "../context/usePrincipal";
import { RoutePaths } from "./RoutePaths";

export default function ProtectedRoute() {
    const { status } = usePrincipal();

    if (status == AuthStatus.INITIALIZING) {
        return null;
    }

    if (status === AuthStatus.UNAUTHENTICATED) {
        return <Navigate to={RoutePaths.HOME} replace />;
    }

    return <Outlet />;
}
