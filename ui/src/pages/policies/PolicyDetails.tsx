import { useParams } from "react-router-dom";
import DashboardLayout from "../dashboard/Dashboard";
import { RoutePaths } from "../../routes/RoutePaths";

export default function PolicyDetails() {
    const { id } = useParams<{ id: string }>();

    return (
        <DashboardLayout
            title="Policy Details"
            breadCrumbs={{
                anchors: [
                    {
                        text: "Policies",
                        uri: RoutePaths.POLICIES,
                    },
                    {
                        text: `Policy: ${id}`,
                        uri: "#",
                    },
                ],
            }}
            description={`Details about ${id}`}
        >
            <div className="w-full"></div>
        </DashboardLayout>
    );
}
