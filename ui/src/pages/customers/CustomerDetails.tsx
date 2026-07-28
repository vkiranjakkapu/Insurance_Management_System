import { useParams } from "react-router-dom";
import DashboardLayout from "../dashboard/Dashboard";
import { RoutePaths } from "../../routes/RoutePaths";

export default function CustomerDetails() {
    const { id } = useParams<{ id: string }>();

    return (
        <DashboardLayout
            title="Customer Details"
            breadCrumbs={{
                anchors: [
                    {
                        text: "Customers",
                        uri: RoutePaths.CUSTOMERS,
                    },
                    {
                        text: `Customer: ${id}`,
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
