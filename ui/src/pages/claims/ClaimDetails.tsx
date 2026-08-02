import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { RoutePaths } from "../../routes/RoutePaths";

export default function ClaimDetails() {
    const { id } = useParams<{ id: string }>();

    return (
        <DashboardLayout
            title="Claim Details"
            breadCrumbs={{
                anchors: [
                    {
                        text: "Claims",
                        uri: RoutePaths.CLAIMS,
                    },
                    {
                        text: `Claim: ${id}`,
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
