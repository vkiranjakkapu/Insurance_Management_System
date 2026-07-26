import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import usePrincipal from "../context/usePrincipal";
import { RoutePaths } from "../routes/RoutePaths";

export default function HomeLayout() {
    const { principal, getHomeRoute } = usePrincipal();
    const currentLocation = useLocation();

    if (principal.isLoggedIn) {
        return (
            <Navigate
                to={
                    currentLocation.pathname == RoutePaths.HOME
                        ? getHomeRoute(principal.roles)
                        : currentLocation
                }
                replace
            />
        );
    }

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}
