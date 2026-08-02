import { Navigate, Outlet } from "react-router-dom";
import usePrincipal from "../context/usePrincipal";

export default function NonCustomerRoute() {
    const { isCustomer, getHomeRoute, principal } = usePrincipal();

    if (isCustomer()) {
        return <Navigate to={getHomeRoute(principal.roles)} replace />;
    }

    return <Outlet />;
}
