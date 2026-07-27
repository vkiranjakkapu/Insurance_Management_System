import { PlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import type {
    ActionButton,
    CustomTable,
    CustomTableData,
} from "../../components/common/Components";
import { RoutePaths } from "../../routes/RoutePaths";
import { type Policy } from "./Policy";

import { useState } from "react";
import samplePolicies from "../../../public/samplePolicies.json";
import CustomTableComponent from "../../components/CustomTable";

export default function ManagePolicies() {
    const navigate = useNavigate();

    const [allPolicies] = useState<Policy[]>(samplePolicies as Policy[]);
    const [queryPolicies, setQueryPolicies] = useState<Policy[]>(
        samplePolicies as Policy[],
    );
    // const defaultPolicies: Policy[] = [
    //     {
    //         id: 1,
    //         customerName: "Sarah Jenkins",
    //         email: "sarah.j@example.com",
    //         policyType: "Comprehensive Family Life",
    //         status: PolicyStatus.ACTIVE,
    //         premium: "$185.00/mo",
    //     },
    //     {
    //         id: 2,
    //         customerName: "Marcus Chen",
    //         email: "marcus.c@example.com",
    //         policyType: "Auto & Health Shield",
    //         status: PolicyStatus.PENDING_APPROVAL,
    //         premium: "$240.00/mo",
    //     },
    //     {
    //         id: 3,
    //         customerName: "Elena Rostova",
    //         email: "elena.r@example.com",
    //         policyType: "Home Protection Plan",
    //         status: PolicyStatus.OVERRIDE,
    //         premium: "$95.00/mo",
    //     },
    // ];

    function handleSearch(query: string) {
        if (!query.trim()) {
            setQueryPolicies(allPolicies);
            return;
        }

        // Get a reference sample object to extract the real, correctly-cased keys
        // Fallback to empty object if array is empty to prevent crashes
        const sampleObject = allPolicies[0] || {};
        const realKeys = Object.keys(sampleObject);

        const sections = query.split(";");
        const searchCriteria: { key: string; values: string[] }[] = [];

        sections.forEach((sc) => {
            if (!sc.includes(":")) return;

            const [rawKey, rawValues] = sc.split(":");
            const userInputKey = rawKey.trim().toLowerCase(); // Lowercase the user's typed key

            // Dynamic key matching: Find the actual key that matches the lowercase user input
            const matchedRealKey = realKeys.find(
                (realKey) => realKey.toLowerCase() === userInputKey,
            );

            // If the key doesn't exist on our object at all, skip this criteria block
            if (!matchedRealKey) return;

            const values = rawValues
                .split(",")
                .map((v) => v.trim().toLowerCase())
                .filter(Boolean);

            if (values.length > 0) {
                searchCriteria.push({ key: matchedRealKey, values });
            }
        });

        // If no valid criteria could be parsed from the user input, return original list or empty
        if (searchCriteria.length === 0) {
            setQueryPolicies(allPolicies);
            return;
        }

        // 2. Filter using the verified, correctly-cased real keys
        const filteredPolicies = allPolicies.filter((policy) => {
            return searchCriteria.every((criterion) => {
                const claimValue = policy[criterion.key as keyof typeof policy];

                if (claimValue === undefined) return false;

                const normalizedClaimValue = String(claimValue).toLowerCase();

                return criterion.values.some((val) =>
                    normalizedClaimValue.includes(val),
                );
            });
        });

        console.log("Filtered Results:", filteredPolicies);
        setQueryPolicies(filteredPolicies as Policy[]);
    }

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

    const table: CustomTableData<Policy> = {
        headers: Object.keys(allPolicies[0]),
        body: queryPolicies,
        pagination: true,
        perPage: 10,
    };

    const policyTable: CustomTable<Policy> = {
        title: "Customer Policies",
        description: "Manage recent enrollments and active coverage.",
        actionButtons: [addPolicyButton, addPolicyButton2],
        tableData: table,
    };

    function fetchPolicy(policy: Policy) {
        navigate(`${RoutePaths.POLICIES}/${policy.id}`);
    }

    return (
        <CustomTableComponent
            table={policyTable}
            onActionClick={fetchPolicy}
            handleSearch={handleSearch}
        />
    );
}
