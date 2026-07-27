import { PlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import CustomTable, {
    type ActionButton,
    type TableContent,
    type TableData,
} from "../../components/CustomTable";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../routes/RoutePaths";
import { PolicyStatus, type Policy } from "./Policy";

const defaultPolicies: Policy[] = [
    {
        id: 1,
        customerName: "Sarah Jenkins",
        email: "sarah.j@example.com",
        policyType: "Comprehensive Family Life",
        status: PolicyStatus.ACTIVE,
        premium: "$185.00/mo",
    },
    {
        id: 2,
        customerName: "Marcus Chen",
        email: "marcus.c@example.com",
        policyType: "Auto & Health Shield",
        status: PolicyStatus.PENDING_APPROVAL,
        premium: "$240.00/mo",
    },
    {
        id: 3,
        customerName: "Elena Rostova",
        email: "elena.r@example.com",
        policyType: "Home Protection Plan",
        status: PolicyStatus.OVERRIDE,
        premium: "$95.00/mo",
    },
];

const addPolicyButton: ActionButton = {
    text: "New Policy",
    icon: PlusIcon,
    action: () => {
        console.log("Action Button");
    },
};

const addPolicyButton2: ActionButton = {
    text: "New Customer",
    icon: UsersIcon,
    action: () => {
        console.log("Action Button 2");
    },
};

const table: TableContent<Policy> = {
    headers: Object.keys(defaultPolicies[0]),
    body: defaultPolicies,
};

const policyTable: TableData<Policy> = {
    title: "Customer Policies",
    description: "Manage recent enrollments and active coverage.",
    actionButtons: [addPolicyButton, addPolicyButton2],
    data: table,
};

export default function ManagePolicies() {
    const navigate = useNavigate();

    function fetchPolicy(policy: Policy) {
        navigate(`${RoutePaths.POLICIES}/${policy.id}`);
    }

    return <CustomTable table={policyTable} onActionClick={fetchPolicy} />;
}
