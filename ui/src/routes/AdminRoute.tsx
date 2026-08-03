import { Navigate, Outlet } from "react-router-dom";
import usePrincipal from "../context/usePrincipal";

export default function AdminRoute() {
    const { isAdmin, getHomeRoute, principal } = usePrincipal();

    if (!isAdmin()) {
        return <Navigate to={getHomeRoute(principal.roles)} replace />;
    }

    return <Outlet />;
}
