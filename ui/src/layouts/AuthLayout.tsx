import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AuthLayout() {
    return (
        <>
            <Sidebar>
                <Outlet />
            </Sidebar>
        </>
    );
}
