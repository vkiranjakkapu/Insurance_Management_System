import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingPortalComponent from "../components/LoadingPortalComponent";
import Navbar from "../components/Navbar";
import usePrincipal, { AuthStatus } from "../context/usePrincipal";
import { RoutePaths } from "../routes/RoutePaths";

export default function HomeLayout() {
    const { principal, status, isLoggedIn, getHomeRoute } = usePrincipal();
    const currentLocation = useLocation();

    if (isLoggedIn()) {
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
            <LoadingPortalComponent
                isLoading={status == AuthStatus.INITIALIZING}
                message="Restoring your session..."
                subMessage="Please wait while we update your policy data."
            />
            <Navbar />
            <Outlet />
        </>
    );
}
