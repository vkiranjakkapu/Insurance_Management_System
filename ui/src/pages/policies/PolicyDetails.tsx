import { useParams } from "react-router-dom";
import { RoutePaths } from "../../routes/RoutePaths";
import DashboardLayout from "../dashboard/Dashboard";

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
                        text: `${id}`,
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
