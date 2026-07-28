import { RoutePaths } from "../../routes/RoutePaths";
import DashboardLayout from "../dashboard/Dashboard";

export default function AdminDashboard() {
    return (
        <DashboardLayout
            title="Dashboard"
            breadCrumbs={{
                anchors: [
                    {
                        text: "Dashboard",
                        uri: RoutePaths.DASHBOARD,
                    },
                    {
                        text: "Reports",
                        uri: RoutePaths.REPORTS,
                    },
                ],
            }}
            description="reports from IMS"
        >
            <div className="w-full"></div>
        </DashboardLayout>
    );
}
