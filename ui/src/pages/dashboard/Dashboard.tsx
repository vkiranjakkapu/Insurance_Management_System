import usePrincipal from "../../context/usePrincipal";
import useProfile from "../../context/useProfile";
import { RoutePaths } from "../../routes/RoutePaths";
import DashboardLayout from "../../components/DashboardLayout";
import AdminDashBoard from "./AdminDashboard";
import AgentDashboard from "./AgentDashboard";
import CustomerDashBoard from "./CustomerDashboard";

export default function Dashboard() {
    const { isAdmin, isAgent, isCustomer } = usePrincipal();
    const { profile } = useProfile();

    return (
        <DashboardLayout
            title="Dashboard"
            breadCrumbs={{
                anchors: [
                    {
                        text: "Dashboard",
                        uri: RoutePaths.DASHBOARD,
                    },
                ],
            }}
            description={`Welcome back, ${profile?.name}.`}
        >
            <div className="w-full">
                {isAdmin() && <AdminDashBoard />}
                {isAgent() && <AgentDashboard />}
                {isCustomer() && <CustomerDashBoard />}
            </div>
        </DashboardLayout>
    );
}
